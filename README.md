### Ejercicio: Extiende la API agregando: 
- sistema de categorías para tareas, 
- endpoints para estadísticas (tareas completadas por día, productividad por usuario), 
- búsqueda avanzada con filtros booleanos (AND/OR), y 
- un sistema de logs que registre todas las operaciones en un archivo.

---

## Puesta en Marcha

### Requisitos
- **Node.js** v14+ instalado
- **npm** para gestionar dependencias

### Instalación

```bash
# Instalar dependencias
npm install
```

### Ejecución

```bash
# Iniciar el servidor
node api-rest-completa.js
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

---

## Endpoints Disponibles

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/login` | Autenticar usuario y obtener token |

**Credenciales de ejemplo:**
- Admin: `email: admin@example.com` / `password: admin123`
- Usuario: `email: user@example.com` / `password: user123`

---

### Categorías
| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|----------------|
| `GET` | `/api/categorias` | Listar todas las categorías | No |

---

### Tareas
| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|----------------|
| `GET` | `/api/tareas` | Listar tareas (con filtros avanzados) | Sí |
| `GET` | `/api/tareas/:id` | Obtener tarea específica por ID | Sí |
| `POST` | `/api/tareas` | Crear nueva tarea | Sí |
| `PUT` | `/api/tareas/:id` | Actualizar tarea completa | Sí |
| `PATCH` | `/api/tareas/:id` | Actualizar tarea parcialmente | Sí |
| `DELETE` | `/api/tareas/:id` | Eliminar tarea | Sí |

---

### Usuarios
| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|----------------|
| `GET` | `/api/usuarios/:id` | Obtener perfil de usuario | Sí |

---

### Estadísticas
| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|----------------|
| `GET` | `/api/stats/tareas-completadas-por-dia` | Cantidad de tareas completadas por día | Sí |
| `GET` | `/api/stats/productividad-usuarios` | Ranking de productividad de usuarios | Sí |

---

## Ejemplos de Uso

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Respuesta:**
```json
{
  "token": "admin-token",
  "usuario": {
    "id": 1,
    "nombre": "Admin"
  }
}
```

### 2. Listar Tareas
```bash
curl -X GET http://localhost:3000/api/tareas \
  -H "Authorization: Bearer admin-token"
```

### 3. Crear Tarea
```bash
curl -X POST http://localhost:3000/api/tareas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -d '{
    "titulo": "Aprender Routing en Express",
    "descripcion": "Completar guía de routing avanzado",
    "prioridad": "alta",
    "categoria": "programacion"
  }'
```

### 4. Actualizar Tarea (PATCH)
```bash
curl -X PATCH http://localhost:3000/api/tareas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -d '{"completada": true}'
```

### 5. Listar Tareas con Filtros
```bash
# Filtrar por prioridad y búsqueda
curl -X GET "http://localhost:3000/api/tareas?prioridad=alta&q=express" \
  -H "Authorization: Bearer admin-token"

# Filtro avanzado con AND/OR
curl -X GET "http://localhost:3000/api/tareas?filtros={\"operator\":\"AND\",\"conditions\":[{\"field\":\"prioridad\",\"value\":\"alta\"},{\"field\":\"completada\",\"value\":\"false\"}]}" \
  -H "Authorization: Bearer admin-token"
```

### 6. Ver Estadísticas
```bash
curl -X GET http://localhost:3000/api/stats/tareas-completadas-por-dia \
  -H "Authorization: Bearer admin-token"

curl -X GET http://localhost:3000/api/stats/productividad-usuarios \
  -H "Authorization: Bearer admin-token"
```

---

## Sistema de Logs

Todas las operaciones de la API se registran automáticamente en el archivo `logs/operations.log` en formato JSON.

Cada entrada de log contiene:
- `timestamp`: Fecha y hora de la operación (ISO 8601)
- `level`: Nivel del log (`info` o `error`)
- `message`: Descripción de la operación
- `meta`: Información adicional contextual

**Ejemplo de entrada en el log:**
```json
{"timestamp":"2025-12-03T10:30:45.123Z","level":"info","message":"Tarea creada","meta":{"id":4,"usuarioId":1,"titulo":"Aprender Routing en Express"}}
{"timestamp":"2025-12-03T10:31:20.456Z","level":"info","message":"GET /api/tareas 200 45ms","meta":{"method":"GET","url":"/api/tareas","status":200,"durationMs":45,"ip":"::1"}}
```

---

## Notas

- Todas las rutas con `*` requieren autenticación mediante token Bearer.
- El token debe incluirse en el header `Authorization: Bearer <token>`.
- La base de datos está en memoria (no persiste entre reinicios).
- Los logs se guardan permanentemente en `logs/operations.log`.