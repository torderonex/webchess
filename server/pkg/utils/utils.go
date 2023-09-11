package utils

import (
	"crypto/sha1"
	"fmt"
	"os"
)

var salt = os.Getenv("SALT")

// Removes an element from a slice by value (only for comparable types)
func RemoveByValue[T comparable](slice []T, value T) []T {
	for index, elem := range slice {
		if elem == value {
			return Remove(slice, index)
		}
	}
	return slice
}

// Removes an element from a slice by index
func Remove[T any](slice []T, index int) []T {
	return append(slice[:index], slice[index+1:]...)
}

// Generates hash with sh1 func
func GeneratePasswordHash(password string) string {
	hash := sha1.New()
	hash.Write([]byte(password))
	return fmt.Sprintf("%x", hash.Sum([]byte(salt)))
}

func PasswordCompare(hashedPassword, password string) bool {
	return GeneratePasswordHash(password) == hashedPassword
}
