package routes

import (
	"context"
	database "go-backend/database"
	"go-backend/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var validateEvent = validator.New()
var eventCollection *mongo.Collection = database.OpenCollection(database.Client, "Event")
var ticketCollection *mongo.Collection = database.OpenCollection(database.Client, "Ticket")
var descriptionCollection *mongo.Collection = database.OpenCollection(database.Client, "Description")
// CreateEvent creates a new event
func CreateEvent(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	var event models.Event

	if err := c.BindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event.ID = primitive.NewObjectID()
    for i := range event.Tickets {
        event.Tickets[i].ID = primitive.NewObjectID()
    }

	for i:= range event.Description {
		event.Description[i].EventID = event.ID
	}
	// check if the event is valid
	if err := validateEvent.Struct(event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	result, err := eventCollection.InsertOne(ctx, event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var ticketInterfaces []interface{}
	for _, ticket := range event.Tickets {
    	ticketInterfaces = append(ticketInterfaces, ticket)
	}

	res, err := ticketCollection.InsertMany(ctx, ticketInterfaces)

	var descriptionInterfaces []interface{}
	for _, description := range event.Description {
    	descriptionInterfaces = append(descriptionInterfaces, description)
	}

	res2, err := descriptionCollection.InsertMany(ctx, descriptionInterfaces)

	defer cancel()
	c.JSON(http.StatusOK, gin.H{"data": result})
	c.JSON(http.StatusOK, gin.H{"data Ticket": res})
	c.JSON(http.StatusOK, gin.H{"data Ticket": res2})
}

func GetEvents(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	var events []models.Event

	cursor, err := eventCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var event models.Event
		cursor.Decode(&event)
		events = append(events, event)
	}

	defer cancel()
	c.JSON(http.StatusOK, gin.H{"data": events})
}

func SearchEvent(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel() 

	var events []models.Event
	search := c.Param("query")

	cursor, err := eventCollection.Find(ctx, bson.M{"title": bson.M{"$regex": search, "$options": "i"}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var event models.Event
		if err := cursor.Decode(&event); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		events = append(events, event)
	}

	if err := cursor.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": events})
}

func DeleteEvent(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err = eventCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer cancel()
	c.JSON(http.StatusOK, gin.H{"data": "Event deleted"})
}

func GetEventById(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	var event models.Event

	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = eventCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer cancel()
	c.JSON(http.StatusOK, gin.H{"data": event})
}

func FilterRegion (c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	var events []models.Event
	region := c.Param("region")

	cursor, err := eventCollection.Find(ctx, bson.M{"region": region})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var event models.Event
		cursor.Decode(&event)
		events = append(events, event)
	}

	defer cancel()
	c.JSON(http.StatusOK, gin.H{"data": events})
}

func GetDistinctRegions (c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	cursor, err := eventCollection.Distinct(ctx, "region", bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer cancel()
	c.JSON(http.StatusOK, gin.H{"data": cursor})
}

func GetDistinctTopic (c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	cursor, err := eventCollection.Distinct(ctx, "label", bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer cancel()
	c.JSON(http.StatusOK, gin.H{"data": cursor})
}

func GetEventDateRange(c *gin.Context) {
    var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
    defer cancel()
    
    var events []models.Event
    startDateStr := c.Param("startDate")
    endDateStr := c.Param("endDate")
    
    // Parse the dates
    startDate, err := time.Parse("2006-01-02", startDateStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format"})
        return
    }
    
    endDate, err := time.Parse("2006-01-02", endDateStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date format"})
        return
    }
    
    // Query the database
    cursor, err := eventCollection.Find(ctx, bson.M{
        "startdate": bson.M{"$gte": startDate},
        "enddate": bson.M{"$lte": endDate},
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer cursor.Close(ctx)
    
    for cursor.Next(ctx) {
        var event models.Event
        if err := cursor.Decode(&event); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        events = append(events, event)
    }
    
    if err := cursor.Err(); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"data": events})
}

func GetEventPricesRange(c *gin.Context) {
    var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
    defer cancel()
    
    var events []models.Event
    minPriceStr := c.Param("minPrice")
    maxPriceStr := c.Param("maxPrice")
    
    // Parse the prices
    minPrice, err := strconv.ParseFloat(minPriceStr, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid minimum price format"})
        return
    }
    
    maxPrice, err := strconv.ParseFloat(maxPriceStr, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid maximum price format"})
        return
    }
    
    cursor, err := eventCollection.Find(ctx, bson.M{
        "tickets.price": bson.M{"$gte": minPrice, "$lte": maxPrice},
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer cursor.Close(ctx)
    
    for cursor.Next(ctx) {
        var event models.Event
        if err := cursor.Decode(&event); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        events = append(events, event)
    }
    
    if err := cursor.Err(); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"data": events})
}

func GetFilteredEvents(c *gin.Context) {
    var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
    defer cancel()
    
    var events []models.Event
	
    region := c.Query("region")
    label := c.Query("label")
    startTime := c.Query("startTime")
    endTime := c.Query("endTime")
    minPrice := c.Query("minPrice")
    maxPrice := c.Query("maxPrice")

    filter := bson.M{}
    
    if region != "" {
        filter["region"] = region
    }
    if label != "" {
        filter["label"] = label
    }
	if startTime != "" && endTime != "" {
		startDate, err := time.Parse("2006-01-02", startTime)
   		if err != nil {
        	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format"})
       		return
    	}
    
    	endDate, err := time.Parse("2006-01-02", endTime)
    	if err != nil {
        	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date format"})
        	return
    	}
        filter["startdate"] = bson.M{"$gte": startDate}
        filter["enddate"] = bson.M{"$lte": endDate}
    }
	if minPrice != "" && maxPrice != "" {
        minPriceFloat, err := strconv.ParseFloat(minPrice, 64)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid minimum price format"})
            return
        }
        maxPriceFloat, err := strconv.ParseFloat(maxPrice, 64)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid maximum price format"})
            return
        }
        filter["tickets.price"] = bson.M{"$gte": minPriceFloat, "$lte": maxPriceFloat}
    }
    
    cursor, err := eventCollection.Find(ctx, filter)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer cursor.Close(ctx)
    
    for cursor.Next(ctx) {
        var event models.Event
        if err := cursor.Decode(&event); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        events = append(events, event)
    }
    
    if err := cursor.Err(); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"data": events})
}
