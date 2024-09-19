package routes

import(
	controller "go-backend/controllers"
	"github.com/gin-gonic/gin"
)

func UserRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.POST("/register", controller.CreateAccount)
	incomingRoutes.GET("/account/:id", controller.GetAccount)
	incomingRoutes.GET("/accounts", controller.GetAccounts)
	incomingRoutes.POST("account/login", controller.Login)
	incomingRoutes.PUT("/account/update/:id", controller.UpdateAccount)
	incomingRoutes.DELETE("/account/delete/:id", controller.DeleteAccount)
}