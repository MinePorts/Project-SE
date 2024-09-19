package helper

import (
	"context"
	"fmt"
	database "go-backend/database"
	"log"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SignedDetails struct {
	Email      string
	Username string
	Uid        string
	jwt.StandardClaims
}

var accountCollection *mongo.Collection = database.OpenCollection(database.Client, "User")

var SECRET_KEY string = os.Getenv("SECRET_KEY")

func GenerateAllTokens(email string, username string, uid string) (signedToken string, signedRefreshToken string, err error) {
	// Set expiration times for the token and refresh token
	tokenExpirationTime := time.Now().Add(24 * time.Hour).Unix()          // Token valid for 24 hours
	refreshTokenExpirationTime := time.Now().Add(7 * 24 * time.Hour).Unix() // Refresh token valid for 7 days

	// Create token claims
	claims := &SignedDetails{
		Email:    email,
		Username: username,
		Uid:      uid,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: tokenExpirationTime,
		},
	}

	// Create refresh token claims
	refreshClaims := &SignedDetails{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: refreshTokenExpirationTime,
		},
	}

	// Generate token
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		log.Panic(err)
		return "", "", err
	}

	// Generate refresh token
	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		log.Panic(err)
		return "", "", err
	}

	return token, refreshToken, nil
}

func UpdateAllTokens(signedToken string, signedRefreshToken string, userId string) {

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	var updateObj primitive.D

	updateObj = append(updateObj, bson.E{"token", signedToken})
	updateObj = append(updateObj, bson.E{"refreshtoken", signedRefreshToken})

	updatedat, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	updateObj = append(updateObj, bson.E{"updatedat", updatedat})

	upsert := true
	filter := bson.M{"userid": userId}
	opt := options.UpdateOptions{
		Upsert: &upsert,
	}

	_, err := accountCollection.UpdateOne(
		ctx,
		filter,
		bson.D{
			{"$set", updateObj},
		},
		&opt,
	)
	defer cancel()

	if err != nil {
		log.Panic(err)
		return
	}
	return

}

func ValidateToken(signedToken string) (claims *SignedDetails, msg string) {
	token, err := jwt.ParseWithClaims(signedToken, &SignedDetails{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SECRET_KEY), nil
	})

	if err != nil {
		msg = fmt.Sprintf("failed to parse token: %v", err)
		return nil, msg
	}

	claims, ok := token.Claims.(*SignedDetails)
	if !ok || !token.Valid {
		msg = "the token is invalid"
		return nil, msg
	}

	if claims.ExpiresAt < time.Now().Unix() {
		msg = "token is expired"
		return nil, msg
	}

	return claims, ""
}