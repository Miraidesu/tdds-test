import os
import bcrypt
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")  # e.g., "dbname-orgname.turso.io"
AUTH_TOKEN = os.getenv("DATABASE_TOKEN")  # Your JWT token for authentication

engine = create_engine(f"sqlite+{DB_URL}?authToken={AUTH_TOKEN}")

faq_bp = Blueprint('faq_bp', __name__)

@faq_bp.route('/api/preguntas', methods=['GET', 'DELETE', 'POST'])
def get_faq():
	
	if request.method == 'GET':
		try:
			with engine.connect() as conn:
				query = text("""SELECT cod_pregunta AS id, pregunta, respuesta FROM Preguntas_frecuentes""")
				result = conn.execute(query).fetchall()
				
				# Crear una lista de diccionarios con las claves correspondientes
				faq_list = [{"id":row[0], "pregunta": row[1], "respuesta": row[2]} for row in result]

			return jsonify({"faq_list": faq_list}), 200

		except SQLAlchemyError as e:
			print(f"Error al obtener las preguntas: {e}")
			return jsonify({"message": "Ocurrió un error al obtener las preguntas"}), 500
		
	elif request.method == 'POST':
		data = request.json
		print(data)
		with engine.connect() as conn:

			query_max_id = text("""SELECT MAX(cod_pregunta) FROM Preguntas_frecuentes """)
			id = conn.execute(query_max_id).fetchone()
			data["id"] = id[0] + 1
		try:
			with engine.connect() as conn:
				query = text("""INSERT INTO Preguntas_frecuentes VALUES (:id, :pregunta, :respuesta) """)
				result = conn.execute(query, [{"id" : data["id"], "pregunta" : data["titulo"], "respuesta" : data["descripcion"]}])
				print(result)
				conn.commit()					

			return jsonify({"message" : "Pregunta insertada"}), 200

		except SQLAlchemyError as e:
			print(f"Error al insertar pregunta: {e}")
			return jsonify({"message": "Ocurrió un Error al insertar la pregunta"}), 500

		
	elif request.method == 'DELETE':
		data = request.json
		try:
			with engine.connect() as conn:
				# Corregir la consulta DELETE
				query = text("DELETE FROM Preguntas_frecuentes WHERE cod_pregunta = :id")
				result = conn.execute(query, {"id" : data["id"]})
				
				if result.rowcount == 0:
					return jsonify({"message": "Pregunta no encontrada"}), 404

				conn.commit()

			return jsonify({"message" : "Faq eliminada"}), 200

		except SQLAlchemyError as e:
			print(f"Error al eliminar la pregunta: {e}")
			return jsonify({"message": f"Error al eliminar la pregunta: {e}"}), 500