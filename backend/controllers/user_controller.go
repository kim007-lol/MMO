package controllers

import (
	"backend/config"
	"backend/models"
	"backend/utils"
	"math"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// GetUsers mengambil daftar user dengan pagination dan search.
func GetUsers(c *gin.Context) {
	var users []models.User
	var total int64

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit := 10
	offset := (page - 1) * limit
	search := c.Query("search")

	query := config.DB.Model(&models.User{})

	if search != "" {
		likeSearch := "%" + search + "%"
		query = query.Where(
			"nama ILIKE ? OR email ILIKE ? OR username ILIKE ? OR no_hp ILIKE ?",
			likeSearch, likeSearch, likeSearch, likeSearch,
		)
	}

	query.Count(&total)
	query.Limit(limit).Offset(offset).Order("id DESC").Find(&users)

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	utils.SendResponse(c, http.StatusOK, true, "Data users berhasil diambil", gin.H{
		"users":       users,
		"total":       total,
		"page":        page,
		"limit":       limit,
		"total_pages": totalPages,
	})
}

// GetUser mengambil detail satu user berdasarkan ID.
func GetUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		utils.SendResponse(c, http.StatusNotFound, false, "User tidak ditemukan", nil)
		return
	}

	utils.SendResponse(c, http.StatusOK, true, "Detail user", user)
}

// CreateUserInput adalah schema validasi untuk tambah user baru.
type CreateUserInput struct {
	Username string `json:"username" binding:"required,min=3,max=100"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Nama     string `json:"nama" binding:"required"`
	NoHp     string `json:"no_hp"`
	Alamat   string `json:"alamat"`
	Role     string `json:"role" binding:"required"`
}

// CreateUser menambahkan user baru ke database.
func CreateUser(c *gin.Context) {
	var input CreateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendResponse(c, http.StatusBadRequest, false, "Validasi gagal: "+err.Error(), nil)
		return
	}

	// validasi duplicate (pakai shared validator)
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
		Role:     input.Role,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		utils.SendResponse(c, http.StatusInternalServerError, false, "Gagal menambah user", nil)
		return
	}

	utils.SendResponse(c, http.StatusCreated, true, "User berhasil ditambahkan", user)
}

// UpdateUserInput adalah schema validasi untuk edit user.
// Semua field opsional — hanya field yang diisi yang akan diperbarui.
type UpdateUserInput struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Nama     string `json:"nama"`
	NoHp     string `json:"no_hp"`
	Alamat   string `json:"alamat"`
	Role     string `json:"role"`
}

// UpdateUser memperbarui data user berdasarkan ID.
func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		utils.SendResponse(c, http.StatusNotFound, false, "User tidak ditemukan", nil)
		return
	}

	var input UpdateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendResponse(c, http.StatusBadRequest, false, "Validasi gagal: "+err.Error(), nil)
		return
	}

	// cek duplicate username (selain user ini sendiri)
	if input.Username != "" && input.Username != user.Username {
		if utils.IsUsernameExists(input.Username, user.ID) {
			utils.SendResponse(c, http.StatusConflict, false, "Username sudah digunakan", nil)
			return
		}
	}

	// cek duplicate email (selain user ini sendiri)
	if input.Email != "" && input.Email != user.Email {
		if utils.IsEmailExists(input.Email, user.ID) {
			utils.SendResponse(c, http.StatusConflict, false, "Email sudah digunakan", nil)
			return
		}
	}

	// update field yang diisi
	if input.Username != "" {
		user.Username = input.Username
	}
	if input.Email != "" {
		user.Email = input.Email
	}
	if input.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			utils.SendResponse(c, http.StatusInternalServerError, false, "Gagal memproses password", nil)
			return
		}
		user.Password = string(hashed)
	}
	if input.Nama != "" {
		user.Nama = input.Nama
	}
	if input.NoHp != "" {
		user.NoHp = input.NoHp
	}
	if input.Alamat != "" {
		user.Alamat = input.Alamat
	}
	if input.Role != "" {
		user.Role = input.Role
	}

	config.DB.Save(&user)

	utils.SendResponse(c, http.StatusOK, true, "User berhasil diupdate", user)
}

// DeleteUser menghapus user berdasarkan ID.
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		utils.SendResponse(c, http.StatusNotFound, false, "User tidak ditemukan", nil)
		return
	}

	deletedUsername := user.Username
	config.DB.Delete(&user)

	utils.SendResponse(c, http.StatusOK, true, "User "+deletedUsername+" berhasil dihapus", nil)
}
