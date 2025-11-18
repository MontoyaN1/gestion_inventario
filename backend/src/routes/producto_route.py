import os
from flask import Blueprint, current_app, jsonify, request
from ..models.producto_model import Producto
from src.controllers.producto_controller import (
    listar_productos,
    obtener_producto,
    crear_producto,
    actualizar_producto,
    eliminar_producto,
)
from werkzeug.utils import secure_filename

producto_bp = Blueprint("producto_bp", __name__)


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
UPLOAD_FOLDER = "images"


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@producto_bp.route("/listar", methods=["GET"])
def get_productos():
    productos = listar_productos()
    return jsonify(
        [
            {
                "id_producto": p.id_producto,
                "nombre": p.nombre,
                "descripcion": p.descripcion,
                "precio": p.precio,
                "stock_actual": p.stock_actual,
                "stock_minimo": p.stock_minimo,
                "categoria": p.categoria,
                "ruta_imagen": p.ruta_imagen
            }
            for p in productos
        ]
    ), 200


@producto_bp.route("/buscar/<int:id_producto>", methods=["GET"])
def get_producto(id_producto):
    p = obtener_producto(id_producto)
    if not p:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(
        {
            "id_producto": p.id_producto,
            "nombre": p.nombre,
            "descripcion": p.descripcion,
            "precio": p.precio,
            "stock_actual": p.stock_actual,
            "categoria": p.categoria,
        }
    ), 200


# Crear producto
@producto_bp.route("/crear", methods=["POST"])
def post_producto():
    try:
        nombre = request.form.get("nombre")
        descripcion = request.form.get("descripcion")
        precio = request.form.get("precio")
        stock_actual = request.form.get("stock_actual")
        stock_minimo = request.form.get("stock_minimo")
        categoria = request.form.get("categoria")

        ruta_imagen = None
        if "imagen" in request.files:
            file = request.files["imagen"]
            if file and file.filename != "" and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Crear nombre único para evitar colisiones
                from datetime import datetime

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{timestamp}_{filename}"

                upload_folder = current_app.config["UPLOAD_FOLDER"]
                os.makedirs(upload_folder, exist_ok=True)

                file_path = os.path.join(upload_folder, filename)
                print(f"💾 Guardando imagen en: {file_path}")

                file.save(file_path)

                # Verificar que se guardó
                if os.path.exists(file_path):
                    print(f"✅ Imagen guardada exitosamente: {file_path}")
                    ruta_imagen = filename
                else:
                    print(f"❌ Error: No se pudo guardar la imagen en {file_path}")
                    return jsonify({"error": "Error guardando imagen"}), 500

        producto = crear_producto(
            nombre=nombre,
            descripcion=descripcion,
            precio=precio,
            stock_actual=stock_actual,
            stock_minimo=stock_minimo,
            categoria=categoria,
            ruta_imagen=ruta_imagen,
        )
        return jsonify({"message": "Producto creado", "id": producto.id_producto}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@producto_bp.route("/actualizar/<int:id_producto>", methods=["PUT"])
def put_producto(id_producto):
    try:
        producto_actual: Producto = obtener_producto(id_producto=id_producto)

        nombre = request.form.get("nombre")
        descripcion = request.form.get("descripcion")
        precio = request.form.get("precio")
        stock_actual = request.form.get("stock_actual")
        stock_minimo = request.form.get("stock_minimo")
        categoria = request.form.get("categoria")

        ruta_imagen = producto_actual.ruta_imagen
        if "imagen" in request.files:
            file = request.files["imagen"]
            if file and file.filename != "" and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                from datetime import datetime

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{timestamp}_{filename}"

                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(file_path)
                ruta_imagen = filename

        producto = actualizar_producto(
            id_producto,
            nombre=nombre,
            descripcion=descripcion,
            precio=precio,
            stock_actual=stock_actual,
            stock_minimo=stock_minimo,
            categoria=categoria,
            ruta_imagen=ruta_imagen,
        )
        if not producto:
            return jsonify({"error": "Producto no encontrado"}), 404
        return jsonify({"message": "Producto actualizado"}), 200
    except Exception as e:
        print(f"Error al actualizar: {e}")
        return jsonify({"error": str(e)}), 400


# Eliminar producto
@producto_bp.route("/eliminar/<int:id_producto>", methods=["DELETE"])
def delete_producto(id_producto):
    ok = eliminar_producto(id_producto)
    if not ok:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify({"message": "Producto eliminado"}), 200
