import json
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

engine = create_engine(f"sqlite+{DB_URL}?authToken={AUTH_TOKEN}")



modify_bp = Blueprint('modify_bp', __name__)



# register movido del AUTH

@modify_bp.route('/api/modify', methods=['POST', 'GET', 'PUT', 'DELETE', 'PATCH'])
def modify_user():
    if request.method == 'POST':
        with engine.connect() as conn:
            data = request.json
            rut = data.get("rut")  # Obtén el RUT enviado en el request

            # Consulta SQL con INNER JOIN a la tabla Comunas
            query = text("""
                SELECT Usuario.Rut, Usuario.nombre, Usuario.apellido, Usuario.fec_nac, 
                       Usuario.direccion, cod_comuna, 
                       Usuario.email, Usuario.telefono 
                FROM Usuario
                WHERE Usuario.Rut = :rut
            """)
            
            # Ejecutamos la consulta con el parámetro 'rut'
            result = conn.execute(query, {"rut": rut}).fetchone()
            
            # Verificamos si el usuario existe
            if result:
                # Formateamos los datos en un diccionario JSON
                user_data = {
                    "rutNum": result[0],
                    "name": result[1],
                    "surname": result[2],
                    "birthday": result[3],
                    "direccion": result[4],
                    "comuna": result[5],  # Nombre de la comuna
                    "email": result[6],
                    "phone": result[7]
                }
                print(user_data)
                return jsonify(user_data), 200
            else:
                return jsonify({"error": "Usuario no encontrado"}), 404
            
    elif request.method == 'PUT':
        data = request.json
        rut = data.get("rutNum")
        user_password = data.get("password")  # Obtén el RUT enviado en el request
        with engine.connect() as conn:
                
            # Consulta SQL con INNER JOIN a la tabla USUARIOS
            query = text(""" SELECT password FROM Usuario WHERE Rut = :rut""")
            result = conn.execute(query, {"rut": rut}).fetchone()

            stored_password_hash = result[0]

            if bcrypt.checkpw(user_password.encode('utf-8'), stored_password_hash.encode('utf-8')):
                data = request.json
                hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
                query = text("""
                    UPDATE Usuario SET 
                        nombre = :name,
                        apellido = :surname,
                        fec_nac = :birthday,
                        direccion = :direccion,
                        cod_comuna = :comuna,
                        email = :email,
                        telefono = :phone,
                        password = :password,
                        confirmado = :confirmado
                    WHERE Rut = :rutNum
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
                    'password': hashed_password.decode('utf-8'),
                    }
                
                result = conn.execute({query, params})
                conn.commit()

            else:
                return jsonify({"message" : "Contraseña actual incorrecta"}), 409
            

    elif request.method == 'PATCH':
        data = request.json
        rut = data.get("rutNum") # Obtén el RUT enviado en el request
        with engine.connect() as conn:
                
            data = request.json
            query = text("""
                UPDATE Usuario SET 
                    nombre = :name,
                    apellido = :surname,
                    fec_nac = :birthday,
                    direccion = :direccion,
                    cod_comuna = :comuna,
                    email = :email,
                    telefono = :phone
                WHERE Rut = :rutNum
            """)

            params = {
                'rutNum': data['rutNum'],
                'name': data['name'],
                'surname': data['surname'],
                'birthday': data['birthday'],
                'direccion': data['direccion'],
                'comuna': data['comuna'],
                'email': data['email'],
                'phone': data['phone']
                }
            try:
                result = conn.execute(query, params)
                conn.commit()
                return jsonify({"message": "Datos editados con éxito"}), 201
            except SQLAlchemyError as e:
                if "UNIQUE constraint failed: Usuario.Rut" in str(e):
                    return jsonify({"message": "Rut ya registrado"}), 409
                elif "UNIQUE constraint failed: Usuario.email" in str(e):
                    return jsonify({"message": "Email ya registrado"}), 409
                else:
                    return jsonify({"message": str(e), "error": str(e)}), 500




    try:
        with engine.connect() as connection:
            result = connection.execute(query, params)
            user_id = result.lastrowid  # Obtener el ID del usuario registrado
            connection.commit()
        
        return jsonify({"message": "Usuario registrado con éxito. Revisa tu correo para confirmarlo"}), 201

    except SQLAlchemyError as e:
        if "UNIQUE constraint failed: Usuario.Rut" in str(e):
            return jsonify({"message": "Rut ya registrado"}), 409
        elif "UNIQUE constraint failed: Usuario.email" in str(e):
            return jsonify({"message": "Email ya registrado"}), 409
        else:
            return jsonify({"message": str(e), "error": str(e)}), 500


        # Ejecutamos la consulta con el parámetro 'rut'
        result = conn.execute(query, {"rut": rut}).fetchone()

    return jsonify({"error": "Método no permitido"}), 405


            


