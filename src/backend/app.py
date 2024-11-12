import os
import bcrypt
from datetime import timedelta
from flask import Flask, redirect, request, jsonify, make_response, url_for

from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

from flask_cors import CORS
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
from flask_jwt_extended import (
	JWTManager)

from auth import auth_bp
from schedule import schedule_bp
from dashboard import dashboard_bp

load_dotenv()

# Load environment variables
DB_URL = os.getenv("DATABASE_URL")  # e.g., "dbname-orgname.turso.io"
AUTH_TOKEN = os.getenv("DATABASE_TOKEN")  # Your JWT token for authentication
FLASK_SECRET_KEY = os.getenv("SECRET_KEY")

MAIL_SERVER = os.getenv("MAIL_SERVER")
MAIL_PASS = os.getenv("MAIL_PASSWORD")
MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")

# Create Flask app
app = Flask(__name__)
app.config["SECRET_KEY"] = FLASK_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)



app.config['MAIL_SERVER'] = 'smtp.office365.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = MAIL_SERVER
app.config['MAIL_PASSWORD'] = MAIL_PASS
app.config['MAIL_DEFAULT_SENDER'] = MAIL_DEFAULT_SENDER

app.register_blueprint(auth_bp)
app.register_blueprint(schedule_bp)
app.register_blueprint(dashboard_bp)

mail = Mail(app)
serializer = URLSafeTimedSerializer(FLASK_SECRET_KEY)



CORS(app, resources={r"/*": {
    "origins": "http://localhost:5173", 
    "supports_credentials": True
    }
})
JWTManager(app)
# Set up SQLAlchemy engine
engine = create_engine(f"sqlite+{DB_URL}?authToken={AUTH_TOKEN}")



# Función para enviar correo de confirmación
def send_confirmation_email(email, user_id):
    token = serializer.dumps(user_id, salt='email-confirm')
    confirm_url = url_for('confirm_email', token=token, _external=True)
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

@app.route('/api/register', methods=['POST'])
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
        


@app.route('/confirm_email/<token>', methods=['GET'])
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


@app.route('/api/createProfiles', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_profiles():
    # GET: Obtener la lista de roles y perfiles
    if request.method == "GET":
        try:
            # Consulta para obtener los tipos de usuario (roles)
            with engine.connect() as conn:
                roles_query = text("SELECT cod_tipo_user AS value, tipo_user AS label FROM Tipo_usuario")
                roles_list = [dict(row) for row in conn.execute(roles_query).fetchall()]

                # Consulta para obtener la lista de perfiles
                profiles_query = text("SELECT Rut AS id, nombre, apellido, email, cod_tipo_user AS role FROM Usuario")
                profiles_list = [dict(row) for row in conn.execute(profiles_query).fetchall()]

            return jsonify({"roles_list": roles_list, "profiles_list": profiles_list}), 200

        except SQLAlchemyError as e:
            return jsonify({"message": "Error al obtener perfiles", "error": str(e)}), 500

    # POST: Añadir un nuevo perfil
    elif request.method == "POST":
        data = request.json
        try:
            with engine.connect() as conn:
                insert_query = text("""
                    INSERT INTO Usuario (Rut, digito_verificador, nombre, apellido, email, password, cod_tipo_user)
                    VALUES (:rut, :digito_verificador, :nombre, :apellido, :email, :password, :role)
                """)
                hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
                conn.execute(insert_query, {
                    "rut": data["rut"],
                    "digito_verificador": data["dv"],
                    "nombre": data["name"],
                    "apellido": data["lastname"],
                    "email": data["email"],
                    "password": hashed_password.decode("utf-8"),
                    "role": data["role"]
                })

            return jsonify({"message": "Perfil creado exitosamente"}), 201

        except SQLAlchemyError as e:
            return jsonify({"message": "Error al crear perfil", "error": str(e)}), 500

    # PUT: Actualizar un perfil existente
    elif request.method == "PUT":
        data = request.json
        try:
            with engine.connect() as conn:
                update_query = text("""
                    UPDATE Usuario SET nombre = :nombre, apellido = :apellido, email = :email, cod_tipo_user = :role
                    WHERE Rut = :rut
                """)
                result = conn.execute(update_query, {
                    "rut": data["rut"],
                    "nombre": data["name"],
                    "apellido": data["lastname"],
                    "email": data["email"],
                    "role": data["role"]
                })

                if result.rowcount == 0:
                    return jsonify({"message": "Perfil no se ha encontrado"}), 404

            return jsonify({"message": "Perfil actualizado correctamente"}), 200

        except SQLAlchemyError as e:
            return jsonify({"message": "Error al actualizar perfil", "error": str(e)}), 500

    # DELETE: Eliminar un perfil existente
    elif request.method == "DELETE":
        data = request.json
        try:
            with engine.connect() as conn:
                delete_query = text("DELETE FROM Usuario WHERE Rut = :rut")
                result = conn.execute(delete_query, {"rut": data["rut"]})

                if result.rowcount == 0:
                    return jsonify({"message": "Perfil no encontrado"}), 404

            return jsonify({"message": "Perfil eliminado correctamente"}), 200

        except SQLAlchemyError as e:
            return jsonify({"message": "Error al eliminar perfil", "error": str(e)}), 500


# Run the app
if __name__ == '__main__':
    app.run(debug=True)

# ---------------------------------- CODIGO VIEJO ----------------------------------

# from flask import Flask, request, jsonify

# from flask_cors import CORS
# import bcrypt



# app = Flask(__name__)
# CORS(app, origins=["http://localhost:5173"])

# clientes_list = []
# reservas_list = []
# profiles_list = []
# diagnosticos_list = []




# class Diagnostico ():
#     def __init__(self, cod_consulta, motivo, diagnostico):
#         self.cod_consulta = cod_consulta
#         self.motivo = motivo
#         self.diagnostico = diagnostico

#     def to_dict(self):
#         return {
#         "cod_": self.cod_consulta,
#         "motivo": self.motivo,
#         "diagnostico": self.diagnostico
#         }
    
#     def __str__(self):
#         return self.cod_consulta + self.motivo + self.diagnostico


# class Reserva ():
#     def __init__(self, servicio, fecha, medico, hora):
#         self.servicio = servicio
#         self.fecha = fecha
#         self.medico = medico
#         self.hora = hora

#     def __str__(self):
#         self.servicio, self.fecha, self.medico, self.hora

# class Cliente ():
#     def __init__(self, rut, dig, name, surname, birthday, direccion, comuna, email, phone, password):
#         self.rut = rut
#         self.dig = dig
#         self.name = name
#         self.surname = surname
#         self.birthday = birthday
#         self.direccion = direccion
#         self.comuna = comuna
#         self.email = email
#         self.phone = phone
#         self.password = password
    
#     def __str__(self):
#         return self.rut, self.dig, self.name


    
# class Perfil ():
#     def __init__(self, id, nombre, email, rol):
#         self.id = id
#         self.nombre = nombre
#         self.email = email
#         self.rol = rol

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "name": self.nombre,
#             "email": self.email,
#             "role": self.rol
#         }
    
#     def __str__(self):
#         return self.id, self.nombre, self.email, self.rol


# perfil_1 = Perfil(1, "John Doe", "john@example.com", "Medico")
# perfil_2 = Perfil(2, "Jane Smith", "jane@example.com", "Contador")
# perfil_3 = Perfil(3, "Alice Johnson", "alice@example.com", "Secretaria")
# perfil_4 = Perfil(4, "Bob Williams", "bob@example.com", "Desarrollador")


# profiles_list = [perfil_1, perfil_2, perfil_3, perfil_4]


# @app.route('/api/register', methods=['POST'])
# def register_cliente():
#     data = request.json

#     bytes = data['password'].encode('utf-8')
#     salt = bcrypt.gensalt() 
#     pass_hashed = bcrypt.hashpw(bytes, salt)

#     cliente = Cliente(
#         rut=data['rutNum'],
#         dig=data['rutDig'],
#         name=data['name'],
#         surname=data['surname'],
#         birthday=data['birthday'],
#         direccion=data['direccion'],
#         comuna=data['comuna'],
#         email=data['email'],
#         phone=data['phone'],
#         password=pass_hashed  # Asegúrate de hashear la contraseña
#     )

#     clientes_list.append(cliente)
    
#     for cliente in clientes_list:
#         print(cliente.rut, cliente.dig, cliente.password)
#     return jsonify({
#         'message': 'Cliente registrado con éxito!',
#         "cliente": {
#             "rut": cliente.rut,
#             "dig": cliente.dig,
#             "name": cliente.name,
#             "surname": cliente.surname,
#             "birthday": cliente.birthday,
#             "direccion": cliente.direccion,
#             "comuna": cliente.comuna,
#             "email": cliente.email,
#             "phone": cliente.phone,
#             "password" : cliente.password
#         }
#         }), 201


# @app.route('/api/login', methods=['POST'])
# def login_cliente():
#     data = request.json
#     bytes = data['password'].encode('utf-8')

#     for cliente in clientes_list:
#         print(cliente.rut, cliente.dig, cliente.password)
#         if cliente.rut == data["rutNum"] and bcrypt.checkpw(bytes, cliente.password):
#             return jsonify({'message': "Login exitoso"}), 200

#     return jsonify({'message': "Datos incorrectos"}), 401
    
# @app.route('/api/userSchedule', methods = ['POST'])
# def registrar_reservas():
#     data = request.json

#     reserva = Reserva(
#         servicio = data["service"],
#         fecha=data["date"],
#         medico=data["doctor"],
#         hora=data["timeSlot"]
#     )

#     try:
#         reservas_list.append(reserva)   
#         for reserva in reservas_list:
#             print(reserva.servicio, reserva.fecha, reserva.medico, reserva.hora )
#         return jsonify({"message": "Reserva registrada exitosamente."}), 201
#     except:
#         return jsonify({"message": "Ocurrió un error)"}), 500



# @app.route('/api/userSchedule/servicios', methods=['GET'])
# def get_servicios():
#     servicios = [
#         {"value": "consulta medica", "label": "Consulta médica"},
#         {"value": "examen de laboratorio", "label": "Examen de laboratorio"},
#         ]
#     return jsonify(servicios)

# @app.route('/api/userSchedule/medicos', methods=['GET'])
# def get_medicos():
#     medicos = [
#         {"value": "dr-house", "label": "Dr. House"},
#         {"value": "dr-who", "label": "Dr. Who"},
#         ]
#     return jsonify(medicos)

# @app.route('/api/userSchedule/horarios', methods=['GET'])
# def get_horarios():
#     horarios = [
#         {"value": "18:00", "label": "18:00"},
#         {"value": "19:00", "label": "19:00"},
#         ]
#     return jsonify(horarios)

# @app.route('/api/createProfiles', methods=['GET', 'POST', 'PUT', 'DELETE'])

# def manage_profiles():
#     if request.method == "GET":
#         roles_list = [
#             {"value" : "Medico", "label" : "Medico"},
#             {"value" : "Desarrollador", "label" : "Desarrollador"},
#             {"value" : "Contador", "label" : "Contador"},
#             {"value" : "Administrador", "label" : "Administrador"},
#             {"value" : "Secretaria", "label" : "Secretaria"}
#         ] 

#         profiles_as_dicts = [perfil.to_dict() for perfil in profiles_list]

        
#         return jsonify({"roles_list" : roles_list, "profiles_list" : profiles_as_dicts})
    
#     elif request.method == "POST":              # añadir perfiles
#         data = request.json
#         id = 0
#         new_id = max((perfil.id for perfil in profiles_list), default=0) + 1

#         new_profile = Perfil(new_id, data["name"], data["email"], data["role"])
#         profiles_list.append(new_profile)
#         return jsonify({"message": "Perfil creado exitosamente"}), 201

#     elif request.method == "PUT":               # actualizar perfiles
#         data = request.json
#         for perfil in profiles_list:
#             if perfil.id == data["id"]:
#                 perfil.nombre = data["name"]
#                 perfil.email = data["email"]
#                 perfil.rol = data["role"]

#                 return jsonify({"message": "Perfil actualizado correctamente"}), 201
        
#         return jsonify({"message": "Perfil no encontrado"}), 404

#     elif request.method == "DELETE":
#         data = request.json

#         # Encontrar el perfil a eliminar
#         perfil_to_delete = next((perfil for perfil in profiles_list if perfil.id == data['id']), None)

#         if perfil_to_delete:
#             profiles_list.remove(perfil_to_delete)  # Elimina el perfil de la lista

#             profiles_as_dicts = [perfil.to_dict() for perfil in profiles_list]

#             for perfil in profiles_as_dicts:
#                 print(perfil)

#             return jsonify({"message": "Perfil eliminado correctamente"}), 200
#         else:
#             return jsonify({"message": "Perfil no encontrado"}), 404
        
# @app.route('/api/diagnostico', methods=['POST'])

# def manage_diagnostic():
#     data = request.json

#     consulta = Diagnostico(
#         cod_consulta = len(diagnosticos_list),
#         motivo = data["motivo"],
#         diagnostico = data["diagnostico"]
#     )

#     diagnosticos_list.append(consulta)

#     print(diagnosticos_list.__str__())
    
#     return jsonify({"message" : "Consulta registrada exitosamente"}), 200


# @app.route('/api/dashboard/pacientes', methods=['POST', 'GET'])

# def manage_dashboard():
#     if request.method == "GET":

#         # select * from pacientes 
# 		# inner join citas on pacientes.id = citas.paciente_id 
# 		# inner join medico on medico.id = citas.medico_id
# 		# where medico.id = 1

# 	    # algo asi deberia ser
    
#         appointmentList = [
#                 {
#                     "id": 1,
#                     "patient": 'Luis Bozo',
#                     "start_date": '2024-11-07T08:00:00',
#                     "end_date": '2024-11-07T09:00:00',
#                 }, {
#                     "id": 2,
#                     "patient": 'Nico Asenjo',
#                     "start_date": '2024-11-08T09:00:00',
#                     "end_date": '2024-11-08T10:00:00',
#                 } ,
#                 {
#                     "id": 3,
#                     "patient": 'Daniel Vargas',
#                     "start_date": '2024-11-07T10:00:00',
#                     "end_date": '2024-11-07T11:00:00',
#                 }
#         ]

#         return jsonify({"citas" : appointmentList})




# if __name__ == '__main__':
#     app.run(debug=True)
