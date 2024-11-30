import os
from tarfile import NUL
import bcrypt
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import create_engine, null, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")  # e.g., "dbname-orgname.turso.io"
AUTH_TOKEN = os.getenv("DATABASE_TOKEN")  # Your JWT token for authentication

engine = create_engine(f"sqlite+{DB_URL}?authToken={AUTH_TOKEN}")

profiles_bp = Blueprint('profiles_bp', __name__)

@profiles_bp.route('/api/createProfiles', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_profiles():
    # GET: Obtener la lista de roles y perfiles
    if request.method == "GET":
        
        try:
            with engine.connect() as conn:
                roles_query = text("SELECT cod_tipo_user AS value, tipo_user AS label FROM Tipo_usuario WHERE cod_tipo_user <> 1" )
                roles_list = []
                for row in conn.execute(roles_query):
                    roles_list.append({"value": row.value, "label": row.label})
                

                profiles_query = text("""SELECT Rut, nombre, apellido, email, 
                                            (SELECT tipo_user FROM Tipo_usuario WHERE cod_tipo_user = Usuario.cod_tipo_user) AS role, 
                                            (SELECT nom_esp FROM Especialidad WHERE cod_esp = Usuario.cod_esp) AS especialidad, 
                                            telefono 
                                        FROM Usuario WHERE cod_tipo_user <> 1;""")
                profiles_list = []
                for row in conn.execute(profiles_query):
                    profiles_list.append({
                        "rut": row.Rut,
                        "name": row.nombre,
                        "lastname": row.apellido,
                        "email": row.email,
                        "phone": row.telefono,
                        "role": row.role,
                        "specialty": row.especialidad
                    })

                specialties = text("SELECT cod_esp AS value, nom_esp AS label FROM Especialidad")
                specialties_list = []
                for row in conn.execute(specialties):
                    specialties_list.append({"value": row.value, "label": row.label})
                


                # print("Profiles list:", profiles_list)  # Agregar log
            return jsonify({"roles_list": roles_list, "profiles_list": profiles_list, "specialties_list" : specialties_list}), 200

        except SQLAlchemyError as e:
            print("Error al obtener perfiles:", e)
            return jsonify({"message": "Error al obtener perfiles", "error": str(e)}), 500

    # POST: Añadir un nuevo perfil
    elif request.method == "POST":
        data = request.json
        print(data["specialty"])
        if data["specialty"] == null:
            data["specialty"] = null
        try:
            with engine.connect() as conn:
                insert_query = text("""
                    INSERT INTO Usuario (Rut, nombre, apellido, email, password, cod_tipo_user, telefono, confirmado, cod_esp)
                    VALUES (:rut, :nombre, :apellido, :email, :password, :role, :telefono, :confirmado, :cod_esp)
                """)
                hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
                conn.execute(insert_query, {
                    "rut": data["rutNum"],
                    "nombre": data["name"],
                    "apellido": data["lastname"],
                    "email": data["email"],
                    "password": hashed_password.decode("utf-8"),
                    "role": data["role"],
                    "telefono": data["phone"],
                    "confirmado" : True,
                    "cod_esp" : data["specialty"]
                })
                conn.commit()

            return jsonify({"message": "Perfil creado exitosamente"}), 201

        except SQLAlchemyError as e:
            return jsonify({"message": "Error al crear perfil" + str(e), "error": str(e)}), 500

    # PUT: Actualizar un perfil existente
    elif request.method == "PUT":
        data = request.json

        # password_hashed = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
        try:
            with engine.connect() as conn:
                update_query = text("""
                    UPDATE Usuario SET nombre = :nombre, apellido = :apellido, email = :email, telefono = :telefono, cod_tipo_user = :role, cod_esp = :specialty
                    WHERE Rut = :rut
                """)
                result = conn.execute(update_query, {
                    "nombre": data["name"],
                    "apellido": data["lastname"],
                    "email": data["email"],
                    "telefono": data["phone"],
                    "rut": data["rutNum"],
                    "role" : int(data["role"]),
                    "specialty" : data["specialty"]
                })

                if result.rowcount == 0:
                    return jsonify({"message": "Perfil no se ha encontrado"}), 404
                
                conn.commit()

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
                
                conn.commit()

            return jsonify({"message": "Perfil eliminado correctamente"}), 200

        except SQLAlchemyError as e:
            return jsonify({"message": "Error al eliminar perfil", "error": str(e)}), 500
        


@profiles_bp.route('/api/updatePassword', methods=['POST'])
def update_password():
    if request.method == "POST":

        data = request.json
        password_hashed = bcrypt.hashpw(data["password"].encode("utf-8"), bcrypt.gensalt())
        print
        try:
            with engine.connect() as conn:
                update_query = text("""
                    UPDATE Usuario SET password = :password
                    WHERE Rut = :rut
                """)
                result = conn.execute(update_query, {
                    "password": password_hashed.decode("utf-8"),
                    "rut": data["rutNum"],
                })

                if result.rowcount == 0:
                    return jsonify({"message": "Perfil no se ha encontrado"}), 404
                
                conn.commit()

            return jsonify({"message": "Contraseña actualizada correctamente"}), 200

        except SQLAlchemyError as e:
            return jsonify({"message": "Error al actualizar la contraseña", "error": str(e)}), 500