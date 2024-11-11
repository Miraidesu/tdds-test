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

import os
import bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

load_dotenv()




# Load environment variables
DB_URL = os.getenv("DATABASE_URL")  # e.g., "dbname-orgname.turso.io"
AUTH_TOKEN = os.getenv("DATABASE_TOKEN")  # Your JWT token for authentication

# Create Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Set up SQLAlchemy engine
engine = create_engine(f"{DB_URL}?authToken={AUTH_TOKEN}")


# API Routes
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json

    # Hashear la contraseña antes de guardarla
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    # Construir la consulta SQL con los valores
    query = text("""
        INSERT INTO Usuario (
            Rut, 
            digito_verificador, 
            nombre, 
            apellido, 
            fec_nac, 
            direccion, 
            cod_comuna, 
            email, 
            telefono, 
            cod_tipo_user, 
            cod_esp, 
            password
        ) VALUES (
            :rutNum, 
            :rutDig, 
            :name, 
            :surname, 
            :birthday, 
            :direccion, 
            :comuna, 
            :email, 
            :phone, 
            1, 
            NULL, 
            :password
        )
    """)

    # Preparar los datos para la consulta
    params = {
        'rutNum': data['rutNum'],
        'rutDig': data['rutDig'],
        'name': data['name'],
        'surname': data['surname'],
        'birthday': data['birthday'],
        'direccion': data['direccion'],
        'comuna': data['comuna'],
        'email': data['email'],
        'phone': data['phone'],
        'password': hashed_password.decode('utf-8')  # Guardar el hash como string
    }

    # Ejecutar la consulta y manejar la transacción
    try:
        with engine.connect() as connection:
            connection.execute(query, params)
            connection.commit()
        return jsonify({"message": "Usuario registrado con éxito"}), 201
    except Exception as e:
        print("Error al registrar usuario:", str(e))
        return jsonify({"message": "Error al registrar usuario", "error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    rut_num = data.get("rutNum")
    password = data.get("password")

    # Convertir RUT a número si es necesario
    try:
        rut_num = int(rut_num)
    except ValueError:
        return jsonify({'message': "El RUT debe ser un número"}), 400

    # Consultar en la base de datos para obtener el hash de la contraseña del usuario
    with engine.connect() as conn:
        query = text("SELECT password FROM Usuario WHERE Rut = :rut")
        result = conn.execute(query, {"rut": rut_num}).fetchone()

        # Verificar si el usuario existe
        if result is None:
            return jsonify({'message': "Datos incorrectos"}), 401

        # Validar la contraseña usando bcrypt
        stored_password_hash = result[0]
        if bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
            return jsonify({'message': "Login exitoso"}), 200
        else:
            return jsonify({'message': "Datos incorrectos"}), 401
        

# Ruta para registrar una reserva
@app.route('/api/userSchedule', methods=['POST'])
def registrar_reservas():
    data = request.json

    # Recoge los datos de la reserva desde el JSON
    rut_paciente = data.get("rutPaciente")
    rut_medico = data.get("rutMedico")
    fecha = data.get("date")
    cod_bloque_hora = data.get("timeSlot")

    # Inserta la reserva en la tabla Reserva
    insert_query = text("""
        INSERT INTO Reserva (rut_paciente, rut_medico, fecha, cod_bloque_hora)
        VALUES (:rut_paciente, :rut_medico, :fecha, :cod_bloque_hora)
    """)

    try:
        with engine.connect() as conn:
            conn.execute(insert_query, {
                "rut_paciente": rut_paciente,
                "rut_medico": rut_medico,
                "fecha": fecha,
                "cod_bloque_hora": cod_bloque_hora
            })
            conn.commit()
        return jsonify({"message": "Reserva registrada exitosamente."}), 201

    except SQLAlchemyError as e:
        print(f"Error al registrar la reserva: {e}")
        return jsonify({"message": "Ocurrió un error al registrar la reserva"}), 500

# Ruta para obtener los servicios (usando la tabla Especialidad)
@app.route('/api/userSchedule/servicios', methods=['GET'])
def get_servicios():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT cod_esp, nom_esp FROM Especialidad")).fetchall()
            servicios = [{"value": row[0], "label": row[1]} for row in result]
        return jsonify(servicios)

    except SQLAlchemyError as e:
        print(f"Error al obtener los servicios: {e}")
        return jsonify({"message": "Ocurrió un error al obtener los servicios"}), 500

# Ruta para obtener los médicos (filtra por tipo de usuario: médico)
@app.route('/api/userSchedule/medicos', methods=['GET'])
def get_medicos():
    try:
        with engine.connect() as conn:
            query = text("""
                SELECT Rut, nombre || ' ' || apellido AS nombre_completo
                FROM Usuario
                WHERE cod_tipo_user = (SELECT cod_tipo_user FROM Tipo_usuario WHERE tipo_user = 'medico')
            """)
            result = conn.execute(query).fetchall()
            medicos = [{"value": row[0], "label": row[1]} for row in result]
        return jsonify(medicos)

    except SQLAlchemyError as e:
        print(f"Error al obtener los médicos: {e}")
        return jsonify({"message": "Ocurrió un error al obtener los médicos"}), 500

# Ruta para obtener los horarios disponibles
@app.route('/api/userSchedule/horarios', methods=['GET'])
def get_horarios():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT cod_bloque_hora, hora FROM Horas")).fetchall()
            horarios = [{"value": row[0], "label": row[1]} for row in result]
        return jsonify(horarios)

    except SQLAlchemyError as e:
        print(f"Error al obtener los horarios: {e}")
        return jsonify({"message": "Ocurrió un error al obtener los horarios"}), 500
    
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
                    return jsonify({"message": "Perfil no encontrado"}), 404

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

    