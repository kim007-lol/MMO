package middleware

import (
	"backend/utils"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWTAuth mengembalikan middleware Gin yang memvalidasi JWT token
// dari header Authorization: Bearer {token}.
func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.SendResponse(c, http.StatusUnauthorized, false, "Token tidak ditemukan", nil)
			c.Abort()
			return
		}

		// ambil token dari "Bearer xxx"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			utils.SendResponse(c, http.StatusUnauthorized, false, "Format token tidak valid", nil)
			c.Abort()
			return
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			// validasi signing method untuk mencegah algorithm switching attack
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			utils.SendResponse(c, http.StatusUnauthorized, false, "Token tidak valid atau sudah expired", nil)
			c.Abort()
			return
		}

		// simpan data user ke context untuk dipakai di handler selanjutnya
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("user_id", claims["user_id"])
			c.Set("username", claims["username"])
			c.Set("role", claims["role"])
		}

		c.Next()
	}
}
