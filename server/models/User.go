package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct{
	ID			primitive.ObjectID	`bson:"_id"`
	UserID		string				`json:"user_id"`
	Username	*string				`json:"username"`
	NIK			*string				`json:"nik"`
	Avatar		*string				`json:"avatar"`
	Token		*string 			`json:"token"`
	RefreshToken	*string			`json:"refresh_token"`
	Password	*string				`json:"password"`
	Phone		*string				`json:"phone"`
	Email		*string				`json:"email"`
	Age			*int				`json:"age"`
	CreatedAt   time.Time			`json:"created_at"`
	UpdatedAt   time.Time			`json:"updated_at"`
	Point 		*int				`json:"point"`
}