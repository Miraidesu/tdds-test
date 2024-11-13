import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

load_dotenv()

# Cargar variables de entorno
DB_URL = os.getenv("DATABASE_URL")
AUTH_TOKEN = os.getenv("DATABASE_TOKEN")
FLASK_SECRET_KEY = os.getenv("SECRET_KEY")

# Configurar el motor de la base de datos
engine = create_engine(f"sqlite+{DB_URL}?authToken={AUTH_TOKEN}", connect_args={"check_same_thread": False})

appoint_bp = Blueprint('appoint_bp', __name__)

@appoint_bp.route('/api/appointments', methods=['GET'])
@jwt_required(locations=["cookies"])
def handle_appointments():
    user_id = get_jwt_identity().get("user")

    if request.method == 'GET':
        return get_appointments(user_id)

def get_appointments(user_id):
    try:
        search = request.args.get('search', '')
        sort = request.args.get('sort', 'fec_inicio')
        
        print(f"Received request - user_id: {user_id}, search: {search}, sort: {sort}")
        
        allowed_sort_columns = ['fec_inicio', 'fec_termino', 'especialidad']
        if sort not in allowed_sort_columns:
            print(f"Invalid sort column: {sort}")
            return jsonify({"error": f"Invalid sort column: {sort}"}), 422
        
        query = text(f"""
            SELECT cod_reserva, rut_medico, especialidad, fec_inicio, fec_termino
            FROM Reserva
            WHERE rut_paciente = :rut_paciente
            AND (especialidad LIKE :search OR rut_medico LIKE :search)
            ORDER BY {sort}
        """)
        
        with engine.connect() as connection:
            result = connection.execute(query, {"rut_paciente": user_id, "search": f"%{search}%"})
            appointments = result.fetchall()

            print(f"SQL Query: {query}")
            print(f"Query parameters: rut_paciente={user_id}, search={search}")
            print(f"Raw result: {appointments}")

            appointments_list = [
                {
                    "id": row[0],
                    "doctor_id": row[1],
                    "specialty": row[2],
                    "start_date": row[3],
                    "end_date": row[4]
                }
                for row in appointments
            ]
        
        print(f"Fetched {len(appointments_list)} appointments")
        print(f"Appointments list: {appointments_list}")
        return jsonify({"appointments": appointments_list}), 200

    except SQLAlchemyError as e:
        print(f"Database error: {str(e)}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Unexpected error occurred"}), 500

@appoint_bp.route('/api/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    try:
        if not appointment_id:
            return jsonify({"error": "Appointment ID is required"}), 400

        # print(f"Deleting appointment - user_id: {user_id}, appointment_id: {appointment_id}")

        query = text("""
            DELETE FROM Reserva
            WHERE cod_reserva = :appointment_id
        """)
        
        with engine.connect() as connection:
            result = connection.execute(query, {"appointment_id": appointment_id})
            connection.commit()

            if result.rowcount == 0:
                # print(f"Appointment not found or unauthorized - appointment_id: {appointment_id}, user_id: {user_id}")
                return jsonify({"error": "Appointment not found or unauthorized"}), 404

        print(f"Appointment deleted successfully - appointment_id: {appointment_id}")
        return jsonify({"message": "Appointment deleted successfully"}), 200

    except SQLAlchemyError as e:
        print(f"Database error: {str(e)}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Unexpected error occurred"}), 500