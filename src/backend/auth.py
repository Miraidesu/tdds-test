import os
import bcrypt
from datetime import timedelta
from flask import request, jsonify, make_response, Blueprint, url_for, redirect
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
from flask_jwt_extended import (
    get_jwt_identity,
	create_access_token, 
	jwt_required,
    unset_jwt_cookies )

load_dotenv()

# Load environment variables
DB_URL = os.getenv("DATABASE_URL")  # e.g., "dbname-orgname.turso.io"
AUTH_TOKEN = os.getenv("DATABASE_TOKEN")  # Your JWT token for authentication
FLASK_SECRET_KEY = os.getenv("SECRET_KEY")

serializer = URLSafeTimedSerializer(FLASK_SECRET_KEY)
engine = create_engine(f"sqlite+{DB_URL}?authToken={AUTH_TOKEN}")

mail = Mail()

auth_bp = Blueprint('auth_bp', __name__)

# Función para enviar correo de confirmación
def send_confirmation_email(email, user_id):
    token = serializer.dumps(user_id, salt='email-confirm')
    confirm_url = url_for('auth_bp.confirm_email', token=token, _external=True)
    msg = Message('Confirma tu correo electrónico', recipients=[email])
    msg.html = f"""
    <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="medicos.png"
              alt="Equipo médico en acción"
            />
    <h2>¡Hola! Nos alegra que quieras ser parte del CESCOF Atacama</h2>
    <p>Por favor Confirma tu correo electrónico</p>
    <a href="{confirm_url}">
        <button>Confirmar Correo</button>
    </a>
    """
    with mail.connect() as conn:
        conn.send(msg)

# register movido del AUTH

@auth_bp.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    query = text("""
        INSERT INTO Usuario (
            Rut, nombre, apellido, fec_nac, direccion, 
            cod_comuna, email, telefono, cod_tipo_user, cod_esp, password, confirmado
        ) VALUES (
            :rutNum, :name, :surname, :birthday, :direccion, :comuna, 
            :email, :phone, 1, NULL, :password, FALSE
        )
    """)
    params = {
        'rutNum': data['rutNum'],
        'name': data['name'],
        'surname': data['surname'],
        'birthday': data['birthday'],
        'direccion': data['direccion'],
        'comuna': data['comuna'],
        'email': data['email'],
        'phone': data['phone'],
        'password': hashed_password.decode('utf-8')
    }
    try:
        with engine.connect() as connection:
            result = connection.execute(query, params)
            user_id = result.lastrowid  # Obtener el ID del usuario registrado
            connection.commit()
        
        send_confirmation_email(data['email'], user_id)
        return jsonify({"message": "Usuario registrado con éxito. Revisa tu correo para confirmarlo"}), 201

    except SQLAlchemyError as e:
        if "UNIQUE constraint failed: Usuario.Rut" in str(e):
            return jsonify({"message": "Rut ya registrado"}), 409
        elif "UNIQUE constraint failed: Usuario.email" in str(e):
            return jsonify({"message": "Email ya registrado"}), 409
        else:
            return jsonify({"message": str(e), "error": str(e)}), 500


@auth_bp.route('/confirm_email/<token>', methods=['GET'])
def confirm_email(token):
    try:
        rut = serializer.loads(token, salt='email-confirm', max_age=3600)
        query = text("UPDATE Usuario SET confirmado = TRUE WHERE rut = :rut")
        params = {'rut': rut}
        with engine.connect() as connection:
            connection.execute(query, params)
            connection.commit()
        return redirect("http://localhost:5173/confirmar", code=307)
    except SignatureExpired:
        return jsonify({"message": "El enlace de confirmación ha expirado."}), 400
    except Exception as e:
        return jsonify({"message": "Error al confirmar el correo.", "error": str(e)}), 500



@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    rut_num = data.get("rutNum")
    password = data.get("password")

    # Calcular el dígito verificador esperado
    # dig = calcular_dv(rut_num)

    # Normalizar ambos dígitos verificadores a mayúsculas y como strings para evitar errores
        
        # Convertir RUT a número si es necesario
    try:
        rut_num = int(rut_num)
    except ValueError:
        return jsonify({'message': "El RUT debe ser un número"}), 400

    # Consultar en la base de datos para obtener el hash de la contraseña del usuario
    with engine.connect() as conn:
        query = text("SELECT password, cod_tipo_user FROM Usuario WHERE Rut = :rut AND confirmado = TRUE")
        result = conn.execute(query, {"rut": rut_num}).fetchone()

        print(result)
        # Verificar si el usuario existe
        if result is None:
            return jsonify({'message': "Datos incorrectos"}), 401

        # Validar la contraseña usando bcrypt
        stored_password_hash = result[0]
        if bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            user_type = None

            if result[1] is not None:
                user_type = result[1]

            access_token = create_access_token(identity={
                "user": rut_num,
                "user_type": user_type
            })

            response = make_response(jsonify({
                'message': "Login exitoso",
                "data": {
                    "user": rut_num,
                    "user_type": user_type
                }}))
            response.set_cookie(
                key="access_token_cookie", value=access_token,
                httponly=True,
                samesite='Strict',
                secure=False
            )

            return response, 200
        else:
            return jsonify({'message': "Datos incorrectos"}), 401
        
    return jsonify({'message': "Datos incorrectos"}), 401

@auth_bp.route("/get_credentials", methods=["GET"])
@jwt_required(locations=["cookies"]) 
def get_credentials():
    current_user = get_jwt_identity()
    print(current_user)
    return jsonify(current_user), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logout exitoso"})
    unset_jwt_cookies(response)
    return response
