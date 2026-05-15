package config

import (
	"backend/models"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedUsers mengisi data demo jika tabel users masih kosong.
// Dipanggil sekali saat koneksi database pertama kali dibuat.
func SeedUsers(db *gorm.DB) {
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count > 0 {
		return
	}

	log.Println("Seeding data demo...")

	password, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Gagal hash password seeder:", err)
		return
	}

	demoUsers := []models.User{
		{Username: "admin", Email: "admin@example.com", Password: string(password), Nama: "Administrator", NoHp: "081234567890", Alamat: "Jl. Sudirman No. 1, Jakarta Pusat", Role: "admin"},
		{Username: "budi", Email: "budi@example.com", Password: string(password), Nama: "Budi Santoso", NoHp: "082345678901", Alamat: "Jl. Gatot Subroto No. 15, Bandung", Role: "user"},
		{Username: "siti", Email: "siti@example.com", Password: string(password), Nama: "Siti Nurhaliza", NoHp: "083456789012", Alamat: "Jl. Diponegoro No. 22, Surabaya", Role: "user"},
		{Username: "andi", Email: "andi@example.com", Password: string(password), Nama: "Andi Wijaya", NoHp: "084567890123", Alamat: "Jl. Ahmad Yani No. 8, Semarang", Role: "user"},
		{Username: "dewi", Email: "dewi@example.com", Password: string(password), Nama: "Dewi Lestari", NoHp: "085678901234", Alamat: "Jl. Malioboro No. 3, Yogyakarta", Role: "user"},
		{Username: "rudi", Email: "rudi@example.com", Password: string(password), Nama: "Rudi Hermawan", NoHp: "086789012345", Alamat: "Jl. Asia Afrika No. 10, Bandung", Role: "user"},
		{Username: "maya", Email: "maya@example.com", Password: string(password), Nama: "Maya Putri", NoHp: "087890123456", Alamat: "Jl. Pemuda No. 45, Medan", Role: "user"},
		{Username: "agus", Email: "agus@example.com", Password: string(password), Nama: "Agus Setiawan", NoHp: "088901234567", Alamat: "Jl. Veteran No. 12, Makassar", Role: "user"},
		{Username: "rina", Email: "rina@example.com", Password: string(password), Nama: "Rina Marlina", NoHp: "089012345678", Alamat: "Jl. Gajah Mada No. 7, Denpasar", Role: "user"},
		{Username: "hendra", Email: "hendra@example.com", Password: string(password), Nama: "Hendra Gunawan", NoHp: "081122334455", Alamat: "Jl. Thamrin No. 20, Jakarta Selatan", Role: "user"},
		{Username: "fitri", Email: "fitri@example.com", Password: string(password), Nama: "Fitri Handayani", NoHp: "082233445566", Alamat: "Jl. Pahlawan No. 18, Malang", Role: "user"},
		{Username: "doni", Email: "doni@example.com", Password: string(password), Nama: "Doni Prasetyo", NoHp: "083344556677", Alamat: "Jl. Merdeka No. 5, Palembang", Role: "user"},
	}

	for _, u := range demoUsers {
		db.Create(&u)
	}
	log.Printf("Seeding selesai: %d users ditambahkan", len(demoUsers))
}
