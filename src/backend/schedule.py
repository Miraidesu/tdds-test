import os
from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")  # e.g., "dbname-orgname.turso.io"
AUTH_TOKEN = os.getenv("DATABASE_TOKEN")  # Your JWT token for authentication

engine = create_engine(f"sqlite+{DB_URL}?authToken={AUTH_TOKEN}")

schedule_bp = Blueprint('schedule_bp', __name__)

# Ruta para registrar una reserva
@schedule_bp.route('/api/userSchedule', methods=['POST'])
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
@schedule_bp.route('/api/userSchedule/servicios', methods=['GET'])
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
@schedule_bp.route('/api/userSchedule/medicos', methods=['GET'])
def get_medicos():
    try:
        with engine.connect() as conn:
            query = text("""
                SELECT Rut, nombre || ' ' || apellido AS nombre_completo
                FROM Usuario
                WHERE cod_tipo_user = (SELECT cod_tipo_user FROM Tipo_usuario WHERE tipo_user = 'Medico')
            """)
            result = conn.execute(query).fetchall()
            medicos = [{"value": row[0], "label": row[1]} for row in result]
        return jsonify(medicos)

    except SQLAlchemyError as e:
        print(f"Error al obtener los médicos: {e}")
        return jsonify({"message": "Ocurrió un error al obtener los médicos"}), 500

# Ruta para obtener los horarios disponibles DEL MEDICO
@schedule_bp.route('/api/userSchedule/horarios/<int:rut>', methods=['GET'])
def get_horarios(rut):
    try:
        with engine.connect() as conn:
            query = text("SELECT fec_inicio FROM Reserva WHERE rut_medico = :rut")
            result = conn.execute(query, {"rut": rut}).fetchall()
            horarios = [{"value": row[0], "label": row[1]} for row in result]
        return jsonify(horarios)

    except SQLAlchemyError as e:
        print(f"Error al obtener los horarios: {e}")
        return jsonify({"message": "Ocurrió un error al obtener los horarios"}), 500
    