package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// konfigurasi CORS supaya kedua frontend bisa akses
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8081", "http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length", "Content-Disposition"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		// auth routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		// user routes (protected)
		users := api.Group("/users")
		users.Use(middleware.JWTAuth())
		{
			users.GET("", controllers.GetUsers)
			users.POST("", controllers.CreateUser)
			users.GET("/:id", controllers.GetUser)
			users.PUT("/:id", controllers.UpdateUser)
			users.DELETE("/:id", controllers.DeleteUser)
		}
	}

	return r
}
