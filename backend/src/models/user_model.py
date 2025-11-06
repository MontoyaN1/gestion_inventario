from ...src import db
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import UserMixin
from datetime import datetime


class Usuario(db.Model, UserMixin):
    id_usuario = db.Column(db.Integer, primary_key=True)
    rol = db.Column(db.String(100), default="Cliente")
    email = db.Column(db.String(100), unique=True)
    username = db.Column(db.String(100))
    password_hash = db.Column(db.String(150))
    date_joined = db.Column(db.DateTime(), default=datetime.utcnow)

    movimientos = db.relationship(
        "Movimiento",
        backref=db.backref("usuario", lazy=True),
        cascade="all, delete-orphan",
    )

    # CORRECCIÓN: get_id() debe usar id_usuario, no id
    def get_id(self):
        """Return the user ID as string."""
        return str(self.id_usuario)  # ← Cambiado de id a id_usuario

    @property
    def password(self):
        raise AttributeError("Password is not a readable Attribute")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password=password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password=password)

    # CORRECCIÓN: __str__ debe mostrar datos, no la clase
    def __str__(self):
        return f"Usuario {self.username} ({self.email})"  # ← Mejorado
