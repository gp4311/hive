# 🐝 Hive - System Requirement Traceability Tool

Hive is a web-based system for managing project requirements, subsystems, and test cases. It helps engineering teams maintain traceability and verification throughout the development lifecycle.

---

## 🚀 Features

- Role-based access control (admin, manager, engineer, reviewer, viewer)
- Project-specific requirements, subsystems, and test cases
- Link requirements to subsystems and test cases
- Track test case status and verification
- File uploads for test evidence
- Traceability matrix
- User and role management per project
- Session restoration and authentication with JWT

---

## 🧱 Tech Stack

- **Frontend:** Angular
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JSON Web Tokens (JWT)

---

## 🖥 How to Run the Project

### 🧩 Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 13
- `npm` or `yarn`

---

### 🖼 Frontend Setup

1. Open terminal and navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend:
   ```bash
   npm run start
   ```
4. Open browser at http://localhost:4200

---

### ⚙️ Backend Setup

1. Create the database in PostgreSQL:
   ```bash
   CREATE DATABASE hive_db;
   ```
2. Run the schema to create tables:
   ```bash
   psql -U your_user -d hive_db -f backend/schema.sql
   ```
3. In the backend folder, create a .env file:
   ```ini
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=hive_db
   JWT_SECRET=your_jwt_secret
   ```
4. Navigate to backend:
   ```bash
   cd backend
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Run the backend server:
   ```bash
   node index.js
   ```
The backend will be available at http://localhost:5000
