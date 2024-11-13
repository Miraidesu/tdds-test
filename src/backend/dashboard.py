import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

load_dotenv()


DB_URL = os.getenv("DATABASE_URL")  # e.g., "dbname-orgname.turso.io"
AUTH_TOKEN = os.getenv("DATABASE_TOKEN")  # Your JWT token for authentication

engine = create_engine(f"sqlite+{DB_URL}?authToken={AUTH_TOKEN}")

dashboard_bp = Blueprint('dashboard_bp', __name__)

@dashboard_bp.route('/api/dashboard/get_appointments', methods=['GET'])
@jwt_required(locations=["cookies"])
def get_appointments():
    try:
        with engine.connect() as conn:
            session = get_jwt_identity()
            query = text("""
                SELECT r.rut_paciente, r.fec_inicio, r.fec_termino,
                CONCAT(u.nombre, ' ', u.apellido) as nombre_paciente,
                u.fec_nac, u.direccion, u.email, u.telefono, r.cod_reserva, r.especialidad,
                COALESCE((SELECT cod_consulta FROM Consulta WHERE cod_reserva = r.cod_reserva), null) as consulta
                FROM Reserva r 
                JOIN Usuario u on r.rut_paciente = u.Rut
				WHERE r.rut_medico = :rut_medico
            """)
            result = conn.execute(query, {"rut_medico": session["user"]}).fetchall()
            horas = [{
                "paciente": {
                    "rut": row[0],
                    "nombre": row[3],
                    "fec_nac": row[4],
                    "direccion": row[5],
                    "email": row[6],
                    "telefono": row[7],
				},
                "id": row[8],
                "consulta": row[10],
                "especialidad": row[9],
                "fec_inicio": row[1],
                "fec_termino": row[2] } for row in result]
        return jsonify(horas)

    except SQLAlchemyError as e:
        print(f"Error al obtener los médicos: {e}")
        return jsonify({"message": "Ocurrió un error al obtener los médicos"}), 500
    
@dashboard_bp.route('/api/dashboard/get_patients', methods=['GET'])
@jwt_required(locations=["cookies"])
def get_patients():
    try:
        with engine.connect() as conn:
            session = get_jwt_identity()
            query = text("""
                SELECT DISTINCT Rut, CONCAT(u.nombre, ' ', u.apellido) as nombre, fec_nac, 
                direccion, (SELECT nom_comuna from Comuna WHERE cod_comuna = u.cod_comuna) as comuna,
                email, telefono
                FROM Reserva r 
                JOIN Usuario u 
                ON r.rut_paciente = u.Rut
				WHERE r.rut_medico = :rut_medico
            """)
            result = conn.execute(query, {"rut_medico": session["user"]}).fetchall()
            horas = [
                {
                    "rut": row[0],
                    "nombre": row[1],
                    "fec_nac": row[2],
                    "direccion": row[3],
                    "comuna": row[4],
                    "email": row[5],
                    "telefono": row[6]
                } for row in result]
        return jsonify(horas)

    except SQLAlchemyError as e:
        print(f"Error al obtener los médicos: {e}")
        return jsonify({"message": "Ocurrió un error al obtener los médicos"}), 500


@dashboard_bp.route('/api/dashboard/get_consulta', methods=['GET'])
@jwt_required(locations=["cookies"])
def get_consulta():
    try:
        with engine.connect() as conn:
            session = get_jwt_identity()
            query = text("""
                SELECT *
                FROM Consulta c 
                JOIN Reserva r
                ON c.cod_reserva = r.cod_reserva
				WHERE r.rut_medico = :rut_medico
            """)
            result = conn.execute(query, {"rut_medico": session["user"]}).fetchall()
            horas = [
                {
                    "cod_consulta": row[0],
                    "cod_reserva": row[1],
                    "motivo": row[2],
                    "diagnostico": row[3]
                } for row in result]
        return jsonify(horas)

    except SQLAlchemyError as e:
        print(f"Error al obtener los médicos: {e}")
        return jsonify({"message": "Ocurrió un error al obtener los médicos"}), 500