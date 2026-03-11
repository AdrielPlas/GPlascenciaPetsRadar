# 🐾 PetRadar API

API REST construida con **NestJS** para registrar mascotas perdidas y encontradas. Cuando se registra una mascota encontrada, el sistema busca automáticamente mascotas perdidas en un radio de **500 metros** usando **PostGIS** y envía notificaciones por correo electrónico.

---

## 🚀 Tecnologías

- **NestJS** – Framework principal
- **TypeORM** – ORM para PostgreSQL
- **PostgreSQL + PostGIS** – Base de datos con soporte geoespacial
- **Nodemailer** – Envío de correos
- **Mapbox Static API** – Mapa dual en el correo

---

## ⚙️ Configuración

### 1. Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=petradar_db
DB_USER=postgres
DB_PASSWORD=your_password
MAILER_SERVICE=gmail
MAILER_EMAIL=tu_correo@gmail.com
MAILER_PASSWORD=tu_app_password
MAPBOX_TOKEN=pk.eyJ1Ijoi...
```

### 2. Base de datos con Docker

```bash
docker compose up -d
```

### 3. Instalar, migrar y correr

```bash
npm install
npm run migration:run
npm run start:dev
```

---

## 📡 Endpoints

### POST `/lost-pets` – Registrar mascota perdida

```json
{
  "name": "Firulais",
  "species": "perro",
  "breed": "Labrador",
  "color": "dorado",
  "size": "grande",
  "description": "Collar rojo, muy amigable",
  "owner_name": "Juan Pérez",
  "owner_email": "juan@example.com",
  "owner_phone": "4771234567",
  "lat": 21.1236,
  "lon": -101.6824,
  "address": "Av. Insurgentes 100, León, Gto.",
  "lost_date": "2025-06-10T14:00:00.000Z"
}
```

### POST `/found-pets` – Registrar mascota encontrada

Busca automáticamente en `lost_pets` dentro de 500m y envía correos.

```json
{
  "species": "perro",
  "breed": "Labrador",
  "color": "dorado",
  "size": "grande",
  "description": "Encontrado en buen estado, sin collar",
  "finder_name": "María López",
  "finder_email": "maria@example.com",
  "finder_phone": "4779876543",
  "lat": 21.1240,
  "lon": -101.6820,
  "address": "Calle Madero 45, León, Gto.",
  "found_date": "2025-06-10T16:30:00.000Z"
}
```

**Respuesta incluye `matchesFound` y `notificationsSent`.**

---

## 📧 Correo de Notificación

Incluye datos de ambas mascotas, contacto del finder y mapa Mapbox con:
- 🔴 Pin rojo = donde se perdió
- 🟢 Pin verde = donde fue encontrada
