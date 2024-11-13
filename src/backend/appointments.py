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

appoint_bp = Blueprint('appoint_bp', __name__)

@appoint_bp.route('/api/appointment', methods=['GET'])
def appointment():
	pass # ejemplo