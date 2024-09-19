package main

import (
	"go-backend/captcha"
	middleware "go-backend/middleware"
	"go-backend/routes"
	"os"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	router := gin.New()				
	router.Use(gin.Logger())	
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"}, 
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "token"},
	}))

	
	routes.UserRoutes(router)
	router.GET("/captcha", gin.WrapF(captcha.GetClickBasicCaptData))
	router.POST("/verif", gin.WrapF(captcha.CheckClickData))
	
	routes.EventRoutes(router)
	routes.BookingRoutes(router)
	
	
	router.Use(middleware.Authentication()) 
	router.Run(":" + port)
}

	// router.GET("/protected", func(c *gin.Context) {
    //     email, _ := c.Get("email")
    //     username, _ := c.Get("username")
    //     uid, _ := c.Get("uid")

    //     c.JSON(200, gin.H{
    //         "email":    email,
    //         "username": username,
    //         "uid":      uid,
    //     })
    // })