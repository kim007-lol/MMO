package utils

import "github.com/gin-gonic/gin"

type APIResponse struct {
	Status  bool        `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func SendResponse(c *gin.Context, code int, status bool, message string, data interface{}) {
	c.JSON(code, APIResponse{
		Status:  status,
		Message: message,
		Data:    data,
	})
}
