# 🚀 Gestión de Electivos

Este repositorio contiene el backend de la plantilla base para el proyecto semestral de ISW en la Universidad del Bío Bío. Fue creado usando Node.js, Express y PostgreSQL. Sigue estos pasos para clonar, configurar y ejecutar el servidor localmente.

---

## 📦 Requisitos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- [Node.js](https://nodejs.org/) (versión 22.XX.X LTS)
- [PostgreSQL](https://www.postgresql.org/) (versión 16.X.X)
- [Git](https://git-scm.com/)

---

## 🔧 Clonar y ejecutar el proyecto

### 1. Clona el repositorio
```bash
git clone https://github.com/HunterUrisus/Backend-Plantilla-MDD-2025-1
cd Backend-Plantilla-MDD-2025-1/
```

### 2. Accede a la carpeta backend e instala las dependencias
```bash
cd backend/
npm install
```

### 3. Renombra el archivo `.env.example` a `.env` y configura las variables de entorno
```bash
#Puerto del servidor
PORT = 5678
HOST = 123.456.789.101

# Configuración de Postgres
DB_HOST = 109.976.543.210
DB_PORT = 1234
DB_USERNAME = username
PASSWORD = password
DATABASE = database_name

# Clave para las sesiones
SESSION_SECRET = ABCDEFGHIJKLMNOPQRSTUVWXYZ

EMAIL = username@domain.com
EMAIL_PROVIDER = gmail
EMAIL_PASSWORD = password123
JWT_SECRET = ZYXWVUTSRQPONMLKJIHGFEDCBA

EXMAPLE_EMAIL_1 = username@domain.com
EXMAPLE_EMAIL_2 = username@domain.com
EXMAPLE_EMAIL_3 = username@domain.com
EXMAPLE_EMAIL_4 = username@domain.com
EXMAPLE_EMAIL_5 = username@domain.com
EXMAPLE_EMAIL_6 = username@domain.com
```

### 4. Configura postgres
- Asegúrate de que tu base de datos tenga las mismas credenciales ingresadas en `.env`.

### 5. Inicia el servidor
```bash
npm start
```