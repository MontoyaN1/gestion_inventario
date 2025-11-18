from src import create_app, db
from flask_migrate import Migrate
import os

# Crear la aplicación Flask
app = create_app()
migrate = Migrate(app, db)

# Leer configuración desde variables de entorno
DEBUG_MODE = os.environ.get("FLASK_DEBUG", "True").lower() == "true"
PORT = int(os.environ.get("FLASK_RUN_PORT", 5000))

if __name__ == "__main__":
    try:
        print(f"🚀 Servidor corriendo en: http://localhost:{PORT}")
        app.run(debug=DEBUG_MODE, host="0.0.0.0", port=PORT)
    except Exception as e:
        print(f"❌ Error al iniciar el servidor: {e}")

