from src import db
from ..models.movimiento_model import Movimiento
from ..models.producto_model import Producto


def crear_movimiento(
    id_producto, id_usuario, cantidad, tipo="venta", forma_pago=None, direccion=None
):
    # Buscar el producto (bloquea fila para evitar errores de concurrencia)
    producto = (
        Producto.query.filter_by(id_producto=id_producto).with_for_update().first()
    )
    if not producto:
        raise ValueError("Producto no encontrado")

    if cantidad <= 0:
        raise ValueError("Cantidad inválida")

    if producto.stock_actual < cantidad:
        raise ValueError("Stock insuficiente")

    try:
        producto.stock_actual -= cantidad
        total = (producto.precio or 0) * cantidad
        movimiento = Movimiento(
            id_producto=id_producto,
            id_usuario=id_usuario,
            tipo_movimiento=tipo,
            forma_pago=forma_pago,
            cantidad=cantidad,
            total=total,
            direccion=direccion,
            estado="completado",
        )

        db.session.add(movimiento)
        db.session.commit()
        return movimiento

    except Exception as e:
        print(f"Error al crear movimiento: {e}")
        db.session.rollback()
        raise
