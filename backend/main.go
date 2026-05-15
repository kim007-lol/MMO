package main

import (
	"backend/config"
	"backend/routes"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// load config dari .env
	if err := godotenv.Load(); err != nil {
		log.Fatal("Gagal load file .env")
	}

	// koneksi database
	config.ConnectDB()

	// setup router
	r := routes.SetupRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server berjalan di http://localhost:%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Gagal menjalankan server:", err)
	}
}
