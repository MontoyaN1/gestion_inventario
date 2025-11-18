from flask import Blueprint, jsonify, request
from src.controllers.movimiento_controller import crear_movimiento
from src.models.movimiento_model import Movimiento

movimientos_bp = Blueprint("movimientos_bp", __name__)


# Registrar movimiento (venta o compra)
@movimientos_bp.route("/crear", methods=["POST"])
def registrar_movimiento():
    data = request.get_json()
    try:
        movimiento = crear_movimiento(
            id_producto=data.get("id_producto"),
            id_usuario=data.get("id_usuario"),
            cantidad=data.get("cantidad"),
            tipo=data.get("tipo", "venta"),
            forma_pago=data.get("forma_pago"),
            direccion=data.get("direccion"),
        )

        from ..models.producto_model import Producto

        producto_actualizado = Producto.query.get(data.get("id_producto"))
        return jsonify(
            {
                "message": "Movimiento registrado",
                "id": movimiento.id_movimiento,
                "producto_actualizado": {  # ✅ Devolver datos del producto actualizado
                    "id_producto": producto_actualizado.id_producto,
                    "stock_actual": producto_actualizado.stock_actual,
                },
            }
        ), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@movimientos_bp.route("/movimientos", methods=["GET"])
def listar_movimientos():
    movimientos = Movimiento.query.all()
    return jsonify(
        [
            {
                "id_movimiento": m.id_movimiento,
                "producto": m.id_producto,
                "usuario": m.id_usuario,
                "tipo": m.tipo_movimiento,
                "cantidad": m.cantidad,
                "total": m.total,
                "fecha": m.fecha.isoformat() if m.fecha else None,
            }
            for m in movimientos
        ]
    ), 200
