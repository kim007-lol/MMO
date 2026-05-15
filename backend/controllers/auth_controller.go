package controllers

import (
	"backend/config"
	"backend/models"
	"backend/utils"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// RegisterInput adalah schema validasi untuk endpoint registrasi.
type RegisterInput struct {
	Username string `json:"username" binding:"required,min=3,max=100"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Nama     string `json:"nama" binding:"required"`
	NoHp     string `json:"no_hp"`
	Alamat   string `json:"alamat"`
}

// LoginInput adalah schema validasi untuk endpoint login.
type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Register menangani pendaftaran akun baru.
func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendResponse(c, http.StatusBadRequest, false, "Validasi gagal: "+err.Error(), nil)
		return
	}

	// cek username & email belum terpakai (pakai shared validator)
	if utils.IsUsernameExists(input.Username) {
		utils.SendResponse(c, http.StatusConflict, false, "Username sudah digunakan", nil)
		return
	}
	if utils.IsEmailExists(input.Email) {
		utils.SendResponse(c, http.StatusConflict, false, "Email sudah digunakan", nil)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.SendResponse(c, http.StatusInternalServerError, false, "Gagal memproses password", nil)
		return
	}

	user := models.User{
		Username: input.Username,
		Email:    input.Email,
		Password: string(hashedPassword),
		Nama:     input.Nama,
		NoHp:     input.NoHp,
		Alamat:   input.Alamat,
		Role:     "user",
	}

	if err := config.DB.Create(&user).Error; err != nil {
		utils.SendResponse(c, http.StatusInternalServerError, false, "Gagal membuat akun", nil)
		return
	}

	utils.SendResponse(c, http.StatusCreated, true, "Registrasi berhasil", gin.H{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
	})
}

// Login menangani proses autentikasi dan mengembalikan JWT token.
func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendResponse(c, http.StatusBadRequest, false, "Validasi gagal: "+err.Error(), nil)
		return
	}

	var user models.User
	// case-insensitive lookup agar konsisten dengan register
	if err := config.DB.Where("LOWER(username) = LOWER(?)", input.Username).First(&user).Error; err != nil {
		utils.SendResponse(c, http.StatusUnauthorized, false, "Username atau password salah", nil)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		utils.SendResponse(c, http.StatusUnauthorized, false, "Username atau password salah", nil)
		return
	}

	// buat JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.ID,
		"username": user.Username,
		"role":     user.Role,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		utils.SendResponse(c, http.StatusInternalServerError, false, "Gagal membuat token", nil)
		return
	}

	utils.SendResponse(c, http.StatusOK, true, "Login berhasil", gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
			"nama":     user.Nama,
			"role":     user.Role,
		},
	})
}
