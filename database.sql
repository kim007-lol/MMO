-- ===========================================
-- Database: mmo_users
-- DBMS: PostgreSQL
-- ===========================================

-- Buat database (jalankan di psql sebagai superuser)
-- CREATE DATABASE mmo_users;

-- Gunakan database mmo_users sebelum menjalankan query di bawah

-- ===========================================
-- Tabel: users
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(150) NOT NULL,
    no_hp VARCHAR(20) DEFAULT '',
    alamat TEXT DEFAULT '',
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_nama ON users(nama);

-- ===========================================
-- Seeder: Data Demo
-- Password untuk semua user: password123
-- Hash bcrypt dari "password123"
-- ===========================================
INSERT INTO users (username, email, password, nama, no_hp, alamat, role) VALUES
('admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrator', '081234567890', 'Jl. Sudirman No. 1, Jakarta Pusat', 'admin'),
('budi', 'budi@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Budi Santoso', '082345678901', 'Jl. Gatot Subroto No. 15, Bandung', 'user'),
('siti', 'siti@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Siti Nurhaliza', '083456789012', 'Jl. Diponegoro No. 22, Surabaya', 'user'),
('andi', 'andi@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Andi Wijaya', '084567890123', 'Jl. Ahmad Yani No. 8, Semarang', 'user'),
('dewi', 'dewi@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Dewi Lestari', '085678901234', 'Jl. Malioboro No. 3, Yogyakarta', 'user'),
('rudi', 'rudi@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Rudi Hermawan', '086789012345', 'Jl. Asia Afrika No. 10, Bandung', 'user'),
('maya', 'maya@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Maya Putri', '087890123456', 'Jl. Pemuda No. 45, Medan', 'user'),
('agus', 'agus@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Agus Setiawan', '088901234567', 'Jl. Veteran No. 12, Makassar', 'user'),
('rina', 'rina@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Rina Marlina', '089012345678', 'Jl. Gajah Mada No. 7, Denpasar', 'user'),
('hendra', 'hendra@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Hendra Gunawan', '081122334455', 'Jl. Thamrin No. 20, Jakarta Selatan', 'user'),
('fitri', 'fitri@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Fitri Handayani', '082233445566', 'Jl. Pahlawan No. 18, Malang', 'user'),
('doni', 'doni@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Doni Prasetyo', '083344556677', 'Jl. Merdeka No. 5, Palembang', 'user')
ON CONFLICT (username) DO NOTHING;
