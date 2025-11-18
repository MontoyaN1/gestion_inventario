from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv
from flask_cors import CORS
from sqlalchemy_utils import database_exists, create_database
import os

# Inicialización global
db = SQLAlchemy()
load_dotenv()

# ==========================
# CONFIGURACIÓN DE VARIABLES
# ==========================
DB_HOST = os.environ.get("DB_HOST", "database")
DB_PORT = os.environ.get("DB_PORT", "3306")
DB_NAME = os.environ.get("DB_NAME", "gestion")
DB_USER = os.environ.get("DB_USER", "inventory_user")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "password123")

ADMIN_NAME = "Admin"
ADMIN_EMAIL = "admin@gestion.com"
ADMIN_PASS = "TSzxvDl1nQ"


# ==========================
# FUNCIÓN PRINCIPAL create_app
# ==========================
def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "8=F&9w4Z{F"
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Imagenes estaticas
    app.config["UPLOAD_FOLDER"] = "/app/images"
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

    # Habilitar CORS (React corre en 3000 normalmente)
    CORS(
        app,
        origins=["http://localhost:3000", "http://localhost:5173"],
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Content-Type", "Authorization"],
    )

    # Inicializar base de datos
    db.init_app(app)

    # Importar modelos para registrar tablas
    from .models.user_model import Usuario  # noqa: F401
    from .models.movimiento_model import Movimiento  # noqa: F401
    from .models.producto_model import Producto  # noqa: F401

    # Configurar login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"

    # ==============
    # BLUEPRINTS
    # ==============
    from .routes.auth_route import auth_bp
    from .routes.producto_route import producto_bp
    from .routes.movimiento_route import movimientos_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(producto_bp, url_prefix="/producto")
    app.register_blueprint(movimientos_bp, url_prefix="/movimiento")

    @app.route("/images/<path:filename>")
    def serve_image(filename):
        from flask import send_from_directory
        import os

        # Debug: verificar si el archivo existe
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        print(f"📁 Buscando imagen: {image_path}")
        print(f"📁 Existe: {os.path.exists(image_path)}")

        if not os.path.exists(image_path):
            print(f"❌ Imagen no encontrada: {filename}")
            return "Imagen no encontrada", 404

        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # ========================
    # CREAR BASE Y ADMIN INICIAL
    # ========================
    with app.app_context():
        try:
            if not database_exists(app.config["SQLALCHEMY_DATABASE_URI"]):
                create_database(app.config["SQLALCHEMY_DATABASE_URI"])
                print("✓ Base de datos MySQL creada")

            db.create_all()
            create_admin()
        except Exception as e:
            print(f"✗ Error inicializando base de datos: {e}")

    return app


# ==========================
# FUNCIÓN create_admin
# ==========================
def create_admin():
    """Crear usuario administrador predeterminado."""
    try:
        from .models.user_model import Usuario

        admin_existente = Usuario.query.filter_by(email=ADMIN_EMAIL).first()
        if admin_existente:
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


# ==========================
# EXPORTACIONES
# ==========================
__all__ = ["db", "create_app", "create_admin"]
