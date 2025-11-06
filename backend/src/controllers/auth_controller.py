from src import db
from ..models.user_model import Usuario


def validar_correo(correo):
    usuario: Usuario = Usuario.query.filter_by(email=correo).first()

    if usuario:
        return usuario
    return False


def validar_usuario(email, password):
    usuario: Usuario = validar_correo(correo=email)

    if usuario:
        if usuario.verify_password(password=password):
            return usuario
        else:
            return False
    else:
        raise Exception("El usaurio no existe")


def crear_usuario(username, email, password, telefono):
    nuevo_usuario: Usuario = Usuario()
    nuevo_usuario.username = username
    nuevo_usuario.email = email
    nuevo_usuario.password = password

    try:
        db.session.add(nuevo_usuario)
        db.session.commit()

        return nuevo_usuario
    except Exception as e:
        db.session.rollback()
        return print(f"Error crear usuario: {e}")
