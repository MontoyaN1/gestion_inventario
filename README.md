# Gestión de inventario mediantes API REST

Es una aplicación que permte la gestión básica de inventarios de productos y servicios con dos vistas, una para administrador para listar, crear, editar y eliminar productos, y una segunda vista para el usuario que puede listar y comprar. El sentido de esto es que el usuario al comprar reste al stock actual que tiene el producto de la cantidad desea con cambios automáticos en ambas vistas.

# Librerías y framewoks de desarrollo

Se utilizó a nivel general `React` para el **frontend** y  `Flask` para el **backend**, más sin embargo cada módulo tiene librerías extras para complementar a los ya mencionados.

## Frontend

Además del ya mencionado React encontramos la siguiente lista de dependencias:

* Axios
* Vite
* eslint

## Backend

Se cuenta con la siguiente lista de dependencias además de Flask:

* blinker
* certifi
* charset-normalizer
* click
* colorama
* idna
* importlib-metadata
* intasend-python
* itsdangerous
* Jinja2
* MarkupSafe
* requests
* SQLAlchemy
* typing_extensions
* urllib3
* Werkzeug
* WTForms
* zipp
* PyMySQL
* python-dotenv
* redis

# Contenedores, Compose y Servicios

Para el desarrollo y despligue de la aplicación se soporto sobre `Docker Compose` que permite la declaración de servicios y contenedores dinámica y paralelamente. Esto garantiza que el proyecto sea el mismo tanto en desarrollo como en producción, haciendo fácil el trasteo de un entorno a otro.

Los servicios utilizados que se ejecutan en Compose son: 

* Backend (Python-Flask)
* Frontend (Node-React)
* Database (MySQL)
* Redis (Sesiones de usuarios)
* PhpMyAdmin (Monitoreo de DB)

# Instalación y uso

Lo primero es tener instalado en la maquina o servidor `Docker` y `Docker Compose` que podremos hacer en dado caso de no tenerlo [docker](https://docs.docker.com/engine/install)  y [compose](https://docs.docker.com/compose/install)

Ahora que estamos seguros de contar con dichas dependencias solo tenemos que tener ejecutado docker o la aplicación de docker en nuestra computadora. Una vez que tengamos listo eso solo queda clonar el repositorio y ejecutar:

```bash
git clone https://github.com/MontoyaN1/gestion_inventario.git
```
```bash
cd gestion_inventario
```
```bash
docker-compose build
```
```bash
docker-compose up
```

Y listo, en unos segundos veremos que los servicios están en funcionamiento y podremos usar la aplicación accediendo al puerto 4000 de nuestra computadora o [localhost:4000](http://localhost:4000)

# Tour por la aplicación

Lo primero que veremos será una vista de login que nos pedirá credenciales. 

![alt text](/doc/img/image.png)

En caso no tener una cuenta podemos darle click en el enlace de **Registrate aquí** y se pediran datos para crear una cuenta

![alt text](/doc/img/image-1.png)

Y ahora podemos acceder como **Cliente** al sistema, ver los productos y comprar en X cantidad

![alt text](/doc/img/image-2.png)

![alt text](/doc/img/image-7.png)

Para entrar como administrador el sistema viene con credenciales quemadas o ya listas que son las siguientes

* Email: admin@gestion.com
* Pass: TSzxvDl1nQ

Ahora entrando en la vista podemos crear productos, editarlos y eliminarlos

![alt text](/doc/img/image-6.png)

![alt text](/doc/img/image-3.png)

![alt text](/doc/img/image-4.png)

![alt text](/doc/img/image-5.png)





