from Backend.src import db
from flask_login import UserMixin
from datetime import datetime


class Producto(db.Model):
    id_producto = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(150))
    stock_actual = db.Column(db.Integer, default=0)
    stock_minimo = db.Column(db.Integer, default=5)
    precio = db.Column(db.Float)
    categoria = db.Column(db.String(100))
    activo = db.Column(db.Boolean, default=True)
    fecha_creacion = db.Column(db.DateTime(), default=datetime.utcnow)

    movimientos = db.relationship("Movimiento", backref="producto", lazy=True)

    def __str__(self):
        return f"Producto {self.nombre} (Stock: {self.stock_actual})"
