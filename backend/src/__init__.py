from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv
import os
from flask_cors import CORS

db = SQLAlchemy()
load_dotenv()

# Configuración MySQL desde variables de entorno
DB_HOST = os.environ.get("DB_HOST", "database")
DB_PORT = os.environ.get("DB_PORT", "3306")
DB_NAME = os.environ.get("DB_NAME", "gestion")
DB_USER = os.environ.get("DB_USER", "inventory_user")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "password123")

ADMIN_NAME = "Admin"
ADMIN_EMAIL = "admin@gestion.com"
ADMIN_PASS = "TSzxvDl1nQ"


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "8=F&9w4Z{F"

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(
        app,
        origins=["http://localhost:3000"],
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Content-Type", "Authorization"],
    )
    db.init_app(app)

    from .models.user_model import Usuario
    from .models.movimiento_model import Movimiento
    from .models.producto_model import Producto

    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"

    from sqlalchemy_utils import database_exists, create_database
    from .routes.auth_route import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")

    with app.app_context():
        try:
            # Verificar si la base de datos existe
            if not database_exists(app.config["SQLALCHEMY_DATABASE_URI"]):
                create_database(app.config["SQLALCHEMY_DATABASE_URI"])
                print("Base de datos MySQL creada")

            # Crear tablas y admin
            db.create_all()
            create_admin()

        except Exception as e:
            print(f"Error inicializando base de datos: {e}")

    return app


__all__ = ["login_required", "rol_required", "roles_required", "db", "login_manager"]


def create_admin():
    """Crear admin después de los roles"""
    try:
        from .models.user_model import Usuario

        # Verificar si ya existe
        if Usuario.query.filter_by(email=ADMIN_EMAIL).first():
            print("✓ Admin ya existe")
            return

        admin = Usuario(
            username=ADMIN_NAME, email=ADMIN_EMAIL, password=ADMIN_PASS, rol_id=1
        )

        db.session.add(admin)
        db.session.commit()
        print("✓ Admin creado exitosamente")

    except Exception as e:
        db.session.rollback()
        print(f"✗ Error creando admin: {e}")
