package config

import (
	"backend/models"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB adalah instance koneksi database global.
var DB *gorm.DB

// ConnectDB membuka koneksi ke PostgreSQL, menjalankan auto-migration,
// dan memanggil seeder jika tabel masih kosong.
func ConnectDB() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal koneksi ke database:", err)
	}

	// auto migrate tabel
	db.AutoMigrate(&models.User{})

	// jalankan seeder kalau tabel masih kosong
	SeedUsers(db)

	DB = db
	log.Println("Database connected & migrated")
}
