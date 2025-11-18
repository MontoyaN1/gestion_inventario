from src import db
from ..models.producto_model import Producto


def listar_productos():
    return Producto.query.all()


def obtener_producto(id_producto):
    return Producto.query.filter_by(id_producto=id_producto).first()


def crear_producto(
    nombre,
    descripcion,
    precio,
    stock_actual,
    stock_minimo,
    categoria,
    ruta_imagen,
):
    producto_nuevo: Producto = Producto(
        nombre=nombre,
        descripcion=descripcion,
        precio=precio,
        stock_actual=stock_actual,
        stock_minimo=stock_minimo,
        categoria=categoria,
        ruta_imagen=ruta_imagen,
    )
    try:
        db.session.add(producto_nuevo)
        db.session.commit()
        return producto_nuevo
    except Exception as e:
        print(f"Error al crear producto: {e}")
        db.session.rollback()
        raise


def actualizar_producto(
    id_producto,
    nombre,
    descripcion,
    precio,
    stock_actual,
    stock_minimo,
    categoria,
    ruta_imagen,
):
    producto: Producto = Producto.query.filter_by(id_producto=id_producto).first()
    if not producto:
        return None

    try:
        producto.nombre = nombre
        producto.descripcion = descripcion
        producto.precio = precio
        producto.stock_actual = stock_actual
        producto.stock_minimo = stock_minimo
        producto.categoria = categoria
        producto.ruta_imagen = ruta_imagen

        db.session.commit()
        return producto
    except Exception as e:
        print(f"Error al actualizar producto: {e}")
        db.session.rollback()
        raise


def eliminar_producto(id_producto):
    producto: Producto = Producto.query.filter_by(id_producto=id_producto).first()
    if not producto:
        return None
    try:
        db.session.delete(producto)
        db.session.commit()
        return True
    except Exception as e:
        print(f"Error al eliminar producto: {e}")
        db.session.rollback()
        raise
