package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Description struct{
	EventID		primitive.ObjectID	`json:"event_id"`
	Description	*string				`json:"description"`
	ImageURL	*string				`json:"image_url"`
	SyaratKetentuan	*string			`json:"syarat_ketentuan"`
}
