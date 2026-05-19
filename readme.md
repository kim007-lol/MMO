# MMO — User Management System

Full stack application untuk **Manajemen Data User** dengan arsitektur:

- **Backend**: Golang (Gin Framework) + PostgreSQL
- **Frontend 1**: CodeIgniter 4 (Server-side Rendering + AJAX)
- **Frontend 2**: ReactJS (Single Page Application / Vite)

Kedua frontend mengkonsumsi **satu API backend yang sama**.

---

## Struktur Folder

```
MMO/
├── backend/              # Golang REST API (Gin + GORM)
│   ├── main.go           # Entry point
│   ├── config/           # Database connection + seeder
│   ├── controllers/      # Auth & User controllers
│   ├── middleware/        # JWT middleware
│   ├── models/           # GORM models
│   ├── routes/           # Route definitions
│   └── utils/            # Helper functions
│
├── frontend-ci4/         # CodeIgniter 4 Frontend
│   └── app/
│       ├── Controllers/  # Auth & User controllers
│       ├── Filters/      # JWT auth filter
│       └── Views/        # Blade-style views
│
├── frontend-react/       # React SPA (Vite)
│   └── src/
│       ├── api/          # Axios instance
│       ├── components/   # Reusable components
│       ├── context/      # Auth & Toast context
│       └── pages/        # Page components
│
├── database.sql          # PostgreSQL schema + seeder
└── README.md
```

---

## Prasyarat

Pastikan sudah terinstall:

- **Go** >= 1.21
- **Node.js** >= 18
- **PHP** >= 8.1
- **Composer** >= 2.x
- **PostgreSQL** >= 14

---

## Cara Install & Menjalankan

### 1. Setup Database

```bash
# Buat database di PostgreSQL
psql -U postgres -c "CREATE DATABASE mmo_users;"

# (Opsional) Import schema + seeder
psql -U postgres -d mmo_users -f database.sql
```

> **Catatan**: Backend Go (GORM) akan otomatis membuat tabel dan seeder saat pertama kali dijalankan, jadi langkah import SQL ini opsional.

### 2. Backend — Golang

```bash
cd backend

# Sesuaikan config di .env
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, JWT_SECRET

# Install dependencies
go mod tidy

# Jalankan server
go run main.go
```

Server berjalan di **http://localhost:8080**

### 3. Frontend 1 — CodeIgniter 4

```bash
cd frontend-ci4

# Install dependencies
composer install

# Jalankan dev server
php spark serve --port 8081
```

Akses di **http://localhost:8081**

### 4. Frontend 2 — React

```bash
cd frontend-react

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Akses di **http://localhost:5173**

---

## Endpoint API

Base URL: `http://localhost:8080/api`

### Auth (Public)

| Method | Endpoint             | Deskripsi            |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Registrasi akun baru |
| POST   | `/api/auth/login`    | Login, return JWT    |

### Users (Protected — JWT Required)

| Method | Endpoint         | Deskripsi                          |
| ------ | ---------------- | ---------------------------------- |
| GET    | `/api/users`     | List users (`?search=` & `?page=`) |
| GET    | `/api/users/:id` | Detail user                        |
| POST   | `/api/users`     | Tambah user baru                   |
| PUT    | `/api/users/:id` | Update user                        |
| DELETE | `/api/users/:id` | Hapus user                         |

---

## Akun Demo

Semua akun demo menggunakan password yang sama.

| Username | Password    | Role  |
| -------- | ----------- | ----- |
| admin    | password123 | admin |
| budi     | password123 | user  |
| siti     | password123 | user  |

---

## Fitur

### Backend

- REST API dengan Gin Framework
- JWT Authentication (24 jam expiry)
- GORM ORM + Auto Migration + Seeder
- Validasi request (required, email format, min length)
- Duplicate check (username & email, case-insensitive)
- Search (ILIKE query di nama/email/username/no_hp)
- Pagination (10 data per halaman)
- Error handling di setiap endpoint
- CORS dikonfigurasi untuk kedua frontend
- Response JSON standar: `{ status, message, data }`

### Frontend CI4 (SSR + AJAX)

- Halaman login & register (AJAX submit)
- JWT disimpan di PHP session
- Auth filter / middleware
- CRUD Users tanpa reload halaman (full AJAX)
- Modal Bootstrap untuk tambah/edit/detail
- Konfirmasi dialog untuk hapus
- Search dengan debounce (400ms)
- Pagination AJAX
- Loading indicator (skeleton) & toast notification
- Validasi form client-side + server-side
- Responsive design

### Frontend React (SPA)

- React Router v7
- Auth context + Protected Route
- JWT disimpan di localStorage
- Axios interceptor untuk auto-attach token + auto-logout on 401
- CRUD Users (create, read, update, delete)
- Search dengan debounce (400ms)
- Pagination dengan ellipsis
- Delete confirmation modal
- Toast notification (ToastContext)
- Validasi form client-side + alert box untuk error server
- Responsive design

---

## Teknologi

| Layer      | Teknologi                        |
| ---------- | -------------------------------- |
| Backend    | Go, Gin, GORM, JWT, bcrypt       |
| Database   | PostgreSQL                       |
| Frontend 1 | CI4, Bootstrap 5, jQuery, AJAX   |
| Frontend 2 | React, Vite, React Router, Axios |

---

## Video Demo

> Link video demo: https://youtu.be/dHQ2qUyHngs

---

## Catatan Tambahan

- Kedua frontend menggunakan endpoint API yang sama
- CI4 tidak melakukan reload halaman saat operasi CRUD (semua via AJAX)
- Token JWT berlaku 24 jam
- CORS sudah dikonfigurasi untuk `localhost:8081` (CI4) dan `localhost:5173` (React)
- Password di-hash menggunakan bcrypt
- Semua endpoint `/api/users` dilindungi JWT middleware
