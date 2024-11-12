import os
import bcrypt
from datetime import timedelta
from flask import request, jsonify, make_response, Blueprint
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

engine = create_engine(f"sqlite+{DB_URL}?authToken={AUTH_TOKEN}")

auth_bp = Blueprint('auth_bp', __name__)



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
        query = text("SELECT password FROM Usuario WHERE Rut = :rut AND confirmado = TRUE")
        result = conn.execute(query, {"rut": rut_num}).fetchone()

        # Verificar si el usuario existe
        if result is None:
            return jsonify({'message': "Datos incorrectos"}), 401

        # Validar la contraseña usando bcrypt
        stored_password_hash = result[0]
        if bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            user_type = None
            query = text("SELECT cod_tipo_user FROM Usuario WHERE Rut = :rut")
            result = conn.execute(query, {"rut": rut_num}).fetchone()

            if result is not None:
                user_type = result[0]

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
    return jsonify(current_user), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logout exitoso"})
    unset_jwt_cookies(response)
    return response
