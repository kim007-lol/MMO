package utils

import (
	"backend/config"
	"backend/models"
)

// IsUsernameExists mengecek apakah username sudah terpakai (case-insensitive).
// Parameter excludeID opsional — jika diisi, akan mengecualikan user dengan ID tersebut
// (berguna saat update, agar tidak conflict dengan data diri sendiri).
func IsUsernameExists(username string, excludeID ...uint) bool {
	var user models.User
	query := config.DB.Where("LOWER(username) = LOWER(?)", username)
	if len(excludeID) > 0 && excludeID[0] > 0 {
		query = query.Where("id != ?", excludeID[0])
	}
	return query.First(&user).Error == nil
}

// IsEmailExists mengecek apakah email sudah terpakai (case-insensitive).
// Parameter excludeID opsional — jika diisi, akan mengecualikan user dengan ID tersebut.
func IsEmailExists(email string, excludeID ...uint) bool {
	var user models.User
	query := config.DB.Where("LOWER(email) = LOWER(?)", email)
	if len(excludeID) > 0 && excludeID[0] > 0 {
		query = query.Where("id != ?", excludeID[0])
	}
	return query.First(&user).Error == nil
}
