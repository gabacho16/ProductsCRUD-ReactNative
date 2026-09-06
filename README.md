# Actividad 3 CRUD con React Native

## Integrantes
- José Gabriel Ley Muñoz   AL03012237
- María Fernanda Núñez Ramírez AL03088031
- Damián Reza Ortíz AL07095141


---

## Descripción del Proyecto
Aplicación móvil desarrollada con *React Native* y *Expo* que permite gestionar un inventario completo de productos mediante el consumo de una API REST. La app implementa un *CRUD completo* (Crear, Leer, Actualizar y Eliminar), filtrado por categorías, manejo de estados de carga, errores y confirmaciones visuales para una óptima experiencia de usuario (UI/UX).

El flujo de datos de la aplicación se rige bajo la arquitectura: *API → Zustand → Interfaz*.

---

## Tecnologías y Herramientas Utilizadas
- *React Native*
- *Expo*
- *Expo Router* (Navegación basada en archivos)
- *Zustand* (Gestión de estado global)
- *API REST* (https://octramtechnologies/api)

---

## Funcionalidades Principales
- Listado de Productos: Visualización general de todos los productos disponibles.
- Detalle de Producto: Consulta de información específica por ID.
- Filtrado por Categoría: Selección y filtrado rápido de productos según su categoría.
- Creación de Productos: Formulario para registrar nuevos artículos.
- Edición de Productos: Modificación de la información de artículos existentes.
- Eliminación con Confirmación: Alerta de seguridad antes de borrar un producto.
- Actualización Dinámica: Sincronización automática de la interfaz tras crear, editar o eliminar.
- Estados de Feedback: Indicadores de carga (loading), manejo de errores y mensajes informativos cuando no existan productos.

---

## Endpoints de la API
| Método | Endpoint | Función |
| :--- | :--- | :--- |
| *GET* | /api/products | Listar productos |
| *GET* | /api/products/:id | Consultar producto específico |
| *POST* | /api/products | Crear un nuevo producto |
| *PATCH* | /api/products/:id | Editar un producto existente |
| *DELETE* | /api/products/:id | Eliminar un producto |
| *GET* | /api/categories | Consultar categorías disponibles |

---

## Instrucciones para Ejecutar la Aplicación

Sigue estos pasos para clonar y poner en marcha el proyecto en tu entorno local:

### 1. Prerrequisitos
Asegúrate de tener instalado en tu computadora:
- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- Un gestor de paquetes como *npm* o *yarn*
- La aplicación *Expo Go* instalada en tu dispositivo móvil (iOS/Android) o un emulador configurado.

### 2. Clonar el repositorio y acceder a la carpeta
```bash
git clone https://github.com/gabacho16/ProductsCRUD-ReactNative.git
cd ProductsCRUD-ReactNative
