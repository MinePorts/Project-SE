package routes

import (
	controller "go-backend/controllers"
	"github.com/gin-gonic/gin"
)


func EventRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.POST("/event", controller.CreateEvent)
	incomingRoutes.GET("/events", controller.GetEvents)
	incomingRoutes.DELETE("/event/:id", controller.DeleteEvent)
	incomingRoutes.GET("/event/:id", controller.GetEventById)
	incomingRoutes.GET("/search/:query", controller.SearchEvent)
	incomingRoutes.GET("/filterRegion/:region", controller.FilterRegion)
	incomingRoutes.GET("/GetRegion", controller.GetDistinctRegions)
	incomingRoutes.GET("/GetTopics", controller.GetDistinctTopic)
	incomingRoutes.GET("/GetRangePrice/:minPrice/:maxPrice", controller.GetEventPricesRange)
	incomingRoutes.GET("/GetEventRangeDate/:startDate/:endDate", controller.GetEventDateRange)
	incomingRoutes.GET("/GetFilterEvent", controller.GetFilteredEvents)
	incomingRoutes.GET("/GetTicket/:id", controller.GetTicketID)
}