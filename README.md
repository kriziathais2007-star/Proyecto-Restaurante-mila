# SISTEMA WEB DE GESTIÓN PARA UN RESTAURANTE
https://trello.com/invite/b/69a1f85c0ed4e45d0fc17d32/ATTIe2fd04a19811f5b4cfb389993cdd4bc18F42DF2C/restaurante-milagros-proyecto-senati
<img src="Recursos/Captura de pantalla 2026-04-20 183225.png">
## DESCRIPCIÓN DEL NEGOCIO
#### NOMBRE: 
RESTAURTANTE "  "Milagros"
#### CONTEXTO:
La empresa se dedica al rubro gastronómico, 
específicamente a la preparación y venta de 
alimentos y bebidas en un restaurante pequeño. 
Su actividad principal consiste en ofrecer distintos 
platos a los clientes, los cuales son solicitados a 
través de los mozos y preparados por el personal 
de cocina para su posterior servicio en las mesas 
del establecimiento. 
El restaurante cuenta con personal como mozos y 
trabajadores de cocina, quienes se encargan de 
tomar los pedidos, preparar los alimentos y atender 
a los clientes dentro del local.
## IDENTIFICAR EL PROBLEMA Y SOLUCIÓN
### PROBLEMA
El restaurante presenta problemas de organización 
en la gestión de pedidos, control del personal y 
registro de ventas. Actualmente los pedidos son 
realizados mediante WHATSAPP, pero igual se 
genera mucha confusión entre los mozos y la 
cocina, no existe un control claro de asistencia del 
personal y el cajero no cuenta con un registro 
organizado de las ganancias diarias. 
Además, cuando un plato se termina, no existe un 
sistema que lo elimine automáticamente de la lista 
de pedidos, lo que puede generar errores al 
momento de tomar las órdenes. 

### SOLUCIÓN
Desarrollar un sistema digital que 
permita gestionar los pedidos del 
restaurante, controlar la asistencia del 
personal, organizar la preparación de 
los platos en cocina y llevar un 
registro claro de las ventas y 
ganancias del negocio. 

## REQUERIMIENTOS FUNCIONALES

| USUARIO | ASISTENCIA | PEDIDOS | COCINA | MENÚ |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| El sistema debe permitir registrar nuevos usuarios | El sistema debe registrar la hora de entrada del personal | El sistema debe permitir a los mozos registrar pedidos para las mesas | El sistema debe mostrar a cocina los pedidos enviados por los mozos | El sistema debe mostrar la lista de platos disponibles |
| El sistema debe permitir iniciar sesión con usuario y contraseña | El sistema debe registrar la hora de salida del personal  | El sistema debe registrar automáticamente la hora en que se realizó el pedido | El sistema debe permitir cambiar el estado del plato a “servido” | El sistema debe  permitir agregar nuevos platos |
| El sistema debe permitir editar los datos de los usuarios | El sistema debe determinar si el empleado llegó puntual o tarde | El sistema debe mostrar la lista de pedidos registrados | El sistema debe mostrar los pedidos ordenados según la hora en que se realizaron | El sistema debe permitir editar la información de los platos |
| El sistema debe permitir eliminar usuarios del sistema | El sistema debe mostrar el historial de asistencia por empleado | El sistema debe mostrar el estado del pedido (pendiente, en preparación, servido, entregado) | El sistema debe indicar cuando un pedido está listo para entregar | El sistema debe permitir eliminar platos cuando ya no estén disponibles |
| El sistema debe permitir cerrar sesión de forma segura |  | El sistema debe permitir que el mozo marque el pedido como entregado |  | El sistema debe indicar cuando un plato no está disponible |

## REQUERIMIENTOS NO FUNCIONALES
| SEGURIDAD | RENDIMIENTO | USABILIDAD | MANTENIBILIDAD |
| ------------- | ------------- | ------------- | ------------- |
| Las contraseñas deben almacenarse cifradas en la base de datos | El sistema debe responder en menos de 3 segundos | La interfaz debe ser sencilla e intuitiva para los empleados | El sistema debe estar desarrollado bajo arquitectura MVC |
| El sistema debe restringir el acceso según el rol (administrador, mozo, cocina) | El sistema debe permitir varios usuarios conectados al mismo tiempo | El sistema debe ser accesible desde cualquier navegador web | La base de datos debe estar normalizada |
| El sistema debe cerrar sesión automáticamente por inactividad | Los pedidos deben actualizarse en tiempo real | El sistema debe mostrar mensajes claros cuando ocurra un error | El sistema debe permitir futuras mejoras o actualizaciones |

## STACK COMPLETO
1. Trello = Gestión del proyecto (Kanban)
2. Draw.io = Diagrama ER + Diagrama de Clases
3. Figma = Wireframe + Diseño UI/UX
4. MySQL Workbench = Diseñar y administrar BD
5. IntelliJ = Frontend (HTML,CSS,JS) + Backend (Spring Boot)
6. XAMPP = Servidor Tomcat para correr la app

## TECNOLOGIAS UTILIZADAS
- Java 17
- Spring Boot 3
- MySQL 8
- HTML5, CSS3, JavaScript
- IntelliJ IDEA
- XAMPP (Tomcat)
- MySQL Workbench
- Figma (diseño UI/UX)
- Draw.io (diagramas)
  
## ESTRUCTURA
Proyecto-Restaurante/
<p>├── backend/          → Spring Boot (Java)</p>
<p>│   ├── src/</p>
<p>│   ├── pom.xml</p>
<p>│   └── ...</p>
<P>├── frontend/         → HTML, CSS, JS</p>
<p>│   ├── css/</p>
<p>│   ├── js/</p>
<p>│   └── index.html</p>

## BASE DE DATOS 
El sistema cuenta con 5 tablas principales:


| TABLA | DESCRIPCIÓN |
| ------------- | ------------- |
| Usuario | Representa a las personas que utilizan el sistema, como administrador, mozo o personal de cocina. Permite identificar quién realiza acciones dentro del sistema. |
| Asistencia | Registra la asistencia del personal, incluyendo la hora de entrada, salida y el estado (asistió, tarde o falta). |
| Pedidos | Contiene la información de los pedidos realizados por los mozos, como la mesa, la hora y el estado del pedido. |
| Cocina | Muestra los pedidos enviados por los mozos para su preparación. Permite actualizar el estado de los platos (pendiente, en preparación, servido). |
| Menú | Administra los platos disponibles del restaurante, permitiendo agregar, editar o eliminar platos, así como indicar su disponibilidad. |
<details>

<summary> DIAGRAMA ENTIDAD RELACIÓN (DER)</summary>

<img src='Recursos/entidad-relacion.png'>

</details>

<details>
<summary> DIAGRAMA RELACIONAL (MR)</summary>

<img src='Recursos/modelo relacional.png'>

</details>

## CARDINALIDADES
### USUARIO -- ASISTENCIA (1:N)
Un usuario puede tener muchas asistencias, y una asistencia pertenece a un solo usuario.
### USUARIO -- PEDIDO (1:N)
Un mozo puede registprar muchos pedidos y un pedido lo hace un solo usuario.
### PEDIDO -- PLATO (N:M)
Muchos pedidos puedes pertecen a varios platos, tanto como muchos platos pueden estar en muchos pedidos.

## ESTO SE RESUELVE CON: 'DETALLE PEDIDO'
- Al tener la relación muchos a muchos (N:M), se crea una entidad asociativa o tambien conocida como entidad intermedia.
  
### PEDIDO -- DETALLE PEDIDO (1:N)
Un pedido puede tener varios platos, pero cada detalle pertenece a un pedido.
### PLATO -- DETALLE_PEDIDO (1:N)
Un plato puede estar en muchos pedidos, pero cada detalle tiene un solo plato

## BASE DE DATOS 
```MySQL
CREATE DATABASE IF NOT EXISTS restaurante_db;
USE restaurante_db;

CREATE TABLE usuario (
Id_Usuario INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
rol VARCHAR(20) NOT NULL,
contraseña VARCHAR(100) NOT NULL,
telefono INT NOT NULL,
CONSTRAINT chk_rol CHECK(rol IN('administrador','mozo','cocina'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_spanish_ci;

CREATE TABLE asistencia (
Id_Asistencia INT AUTO_INCREMENT PRIMARY KEY,
fecha DATE NOT NULL,
hora_entrada TIME NOT NULL,
hora_salida TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
estado VARCHAR(20) NOT NULL,
Id_Usuario INT NOT NULL,
FOREIGN KEY (Id_Usuario) REFERENCES usuario(Id_Usuario),
CONSTRAINT chk_estado_asistencia CHECK(estado IN('asistio','tarde','falta'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_spanish_ci;

CREATE TABLE plato (
Id_Plato INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
precio DECIMAL(10,2) NOT NULL,
disponibilidad BOOLEAN NOT NULL DEFAULT TRUE,
CONSTRAINT chk_precio CHECK(precio > 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_spanish_ci;

CREATE TABLE pedido (
Id_Pedido INT AUTO_INCREMENT PRIMARY KEY,
mesa INT NOT NULL,
fecha DATE NOT NULL,
hora_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
estado_pedido VARCHAR(20) NOT NULL,
Id_Usuario INT NOT NULL,
FOREIGN KEY (Id_Usuario) REFERENCES usuario(Id_Usuario),
CONSTRAINT chk_estado_pedido CHECK(estado_pedido IN('pendiente','en preparación','servido','entregado'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_spanish_ci;

CREATE TABLE detalle_pedido (
Id_Detalle INT AUTO_INCREMENT PRIMARY KEY,
cantidad INT NOT NULL,
estado_plato VARCHAR(20) NOT NULL,
Id_Pedido INT NOT NULL,
Id_Plato INT NOT NULL,
FOREIGN KEY (Id_Pedido) REFERENCES pedido(Id_Pedido),
FOREIGN KEY (Id_Plato) REFERENCES plato(Id_Plato),
CONSTRAINT chk_cantidad CHECK (cantidad > 0),
CONSTRAINT chk_estado_plato CHECK(estado_plato IN('falta servir','servido'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_spanish_ci;

INSERT INTO usuario (nombre, rol, contraseña, telefono) VALUES
('Junior','administrador','1234','956 522 524'),
('Valentina','cocina','co123','964 521 475'),
('Manuel','mozo','mo123','912 452 035');
```
## FIGMA
https://www.figma.com/design/niNEN65Fok96fvXG2vjbRs/Sin-t%C3%ADtulo?node-id=0-1&t=48klTXX3gIGawNSu-1

