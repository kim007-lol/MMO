package models

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `gorm:"size:100;uniqueIndex;not null" json:"username"`
	Email     string    `gorm:"size:150;uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"size:255;not null" json:"-"`
	Nama      string    `gorm:"size:150;not null" json:"nama"`
	NoHp      string    `gorm:"size:20" json:"no_hp"`
	Alamat    string    `gorm:"type:text" json:"alamat"`
	Role      string    `gorm:"size:50;default:'user'" json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
