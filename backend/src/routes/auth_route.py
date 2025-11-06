from flask import Blueprint, request, jsonify
from ..controllers.auth_controller import (
    validar_usuario,
    validar_correo,
    crear_usuario,
)
from flask_login import login_user, logout_user, login_required

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    usuario = validar_usuario(email=data.get("email"), password=data.get("password"))

    if usuario:
        login_user(usuario)
        return jsonify(
            {
                "mensaje": "Login exitoso",
                "usuario": {
                    "id_usuario": usuario.id_usuario,
                    "username": usuario.username,
                    "email": usuario.email,
                    "rol_id": usuario.rol_id,
                },
            }
        ), 200

    return jsonify({"error": "Credenciales inválidas"}), 401


@auth_bp.route("/registro", methods=["POST"])
def registro():
    data = request.get_json()

    existe = validar_correo(correo=data.get("email"))
    if existe:
        return jsonify({"error": "El usuario ya existe"}), 400

    nuevo_usuario = crear_usuario(
        username=data.get("username"),
        email=data.get("email"),
        password=data.get("password"),
        telefono=data.get("telefono"),
    )

    if nuevo_usuario:
        login_user(nuevo_usuario)

        return jsonify(
            {
                "mensaje": "Usuario registrado exitosamente",
                "usuario": {
                    "id_usuario": nuevo_usuario.id_usuario,
                    "username": nuevo_usuario.username,
                    "email": nuevo_usuario.email,
                    "rol_id": nuevo_usuario.rol_id,
                },
            }
        ), 201

    return jsonify({"error": "Error al crear usuario"}), 400


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"mensaje": "Logout exitoso"}), 200
