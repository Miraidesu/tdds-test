import os
from datetime import timedelta
from flask import Flask

from flask_cors import CORS
from sqlalchemy import create_engine, modifier
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
from flask_jwt_extended import (
	JWTManager)

from auth import auth_bp, mail
from schedule import schedule_bp
from dashboard import dashboard_bp
from profiles import profiles_bp
from appointments import appoint_bp
from faq import faq_bp
from modify import modify_bp

load_dotenv()

# Load environment variables
DB_URL = os.getenv("DATABASE_URL")  # e.g., "dbname-orgname.turso.io"
AUTH_TOKEN = os.getenv("DATABASE_TOKEN")  # Your JWT token for authentication
FLASK_SECRET_KEY = os.getenv("SECRET_KEY")

# Create Flask app
app = Flask(__name__)
app.config["SECRET_KEY"] = FLASK_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

app.config['MAIL_SERVER'] = 'smtp.office365.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = "correo" # flask-mail klo malo
app.config['MAIL_PASSWORD'] = "contraseña"
app.config['MAIL_DEFAULT_SENDER'] = "correo"

app.register_blueprint(auth_bp)
app.register_blueprint(schedule_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(profiles_bp)
app.register_blueprint(appoint_bp)
app.register_blueprint(faq_bp)
app.register_blueprint(modify_bp)

mail.init_app(app)

CORS(app, resources={r"/*": {
    "origins": "http://localhost:5173", 
    "supports_credentials": True
    }
})
JWTManager(app)
# Set up SQLAlchemy engine
engine = create_engine(f"sqlite+{DB_URL}?authToken={AUTH_TOKEN}")

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
