from Backend.src import db
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import UserMixin
from datetime import datetime


class Movimiento(db.Model):
    id_movimiento = db.Column(db.Integer, primary_key=True)
    id_producto = db.Column(db.Integer, db.ForeignKey("producto.id_producto"), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey("usuario.id_usuario"), nullable=False)
    
    tipo_movimiento = db.Column(db.String(20))  # 'venta', 'compra', 'ajuste'
    forma_pago = db.Column(db.String(50))  # 'efectivo', 'tarjeta', 'transferencia'
    cantidad = db.Column(db.Integer)
    total = db.Column(db.Float)
    direccion = db.Column(db.String(200))
    estado = db.Column(db.String(20), default='pendiente')  # 'completado', 'cancelado'
    
    fecha_movimiento = db.Column(db.DateTime(), default=datetime.utcnow)
    
    # Relaciones
    producto = db.relationship("Producto", backref="movimientos")
    usuario = db.relationship("Usuario", backref="movimientos")
