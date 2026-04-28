# ISO 27001 Audit API - Backend

API REST para la aplicación de auditoría ISO 27001.

## Tecnologías

- **Node.js** + Express
- **PostgreSQL** para persistencia
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas

## Instalación

### 1. Requisitos previos

- Node.js 18+
- PostgreSQL 14+

### 2. Configurar base de datos

```bash
# Crear la base de datos en PostgreSQL
createdb iso27001_audit

# O usando psql:
psql -c "CREATE DATABASE iso27001_audit;"
```

### 3. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus credenciales de PostgreSQL
nano .env
```

### 4. Ejecutar migraciones

```bash
npm run migrate
```

Esto creará las tablas y cargará los 76 controles de ISO 27001:2022 Anexo A.

### 5. Iniciar servidor

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3001`

## Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Login → JWT token |
| GET | `/api/auth/me` | Usuario actual |

### Controles
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/controls` | Listar controles |
| GET | `/api/controls/:id` | Detalle de control |
| PUT | `/api/controls/:id/assessment` | Actualizar evaluación |

### Hallazgos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/findings` | Listar hallazgos |
| POST | `/api/findings` | Crear hallazgo |
| PUT | `/api/findings/:id` | Actualizar |
| DELETE | `/api/findings/:id` | Eliminar |

### Riesgos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/risks` | Listar riesgos |
| POST | `/api/risks` | Crear riesgo |
| PUT | `/api/risks/:id` | Actualizar |
| DELETE | `/api/risks/:id` | Eliminar |

### Planes de Acción
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/action-plans` | Listar planes |
| POST | `/api/action-plans` | Crear plan |
| PUT | `/api/action-plans/:id` | Actualizar |
| DELETE | `/api/action-plans/:id` | Eliminar |

### Tags y Estadísticas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tags` | Listar tags |
| GET | `/api/stats/dashboard` | Estadísticas dashboard |

## Usuario por defecto

Después de ejecutar las migraciones, se crea un usuario admin:

- **Email:** admin@example.com
- **Password:** admin123
- **Rol:** admin

## Estructura del proyecto

```
server/
├── src/
│   ├── index.js           # Entry point
│   ├── config/
│   │   └── database.js    # PostgreSQL connection
│   ├── middleware/
│   │   ├── auth.js        # JWT verification
│   │   └── errorHandler.js
│   └── routes/
│       ├── auth.js
│       ├── controls.js
│       ├── findings.js
│       ├── risks.js
│       ├── actionPlans.js
│       ├── tags.js
│       └── stats.js
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_seed_controls.sql
    └── run.js
```
