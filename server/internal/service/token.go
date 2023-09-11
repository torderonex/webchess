package service

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/torderonex/webchess/server/entities"
	"github.com/torderonex/webchess/server/internal/repository"
)

const (
	accessTTL  = 5 * time.Second
	refreshTTL = 30 * 24 * time.Hour
)

var (
	signingKeyRefresh = os.Getenv("SIGNING_KEY_REFRESH")
	signingKeyAccess  = os.Getenv("SIGNING_KEY_ACCESS")
)

type TokenService struct {
	repos repository.Tokens
}

type Payload struct {
	PlayerID int    `json:"player_id"`
	Roles    string `json:"roles"`
}

type tokenClaims struct {
	jwt.StandardClaims
	PlayerID int    `json:"player_id"`
	Roles    string `json:"roles"`
}

func NewTokenService(repos repository.Tokens) *TokenService {
	return &TokenService{
		repos: repos,
	}
}

func (t *TokenService) GenerateTokens(pd Payload) (tokens map[string]string) {
	tokens = make(map[string]string)
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(accessTTL).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		pd.PlayerID,
		pd.Roles,
	})
	tokens["accessToken"], _ = accessToken.SignedString([]byte(signingKeyAccess))
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(refreshTTL).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		pd.PlayerID,
		pd.Roles,
	})
	tokens["refreshToken"], _ = refreshToken.SignedString([]byte(signingKeyRefresh))
	return tokens
}

func (t *TokenService) SaveToken(userID int, refreshToken string) error {
	_, err := t.repos.GetRefreshToken(userID)
	if err != nil {
		return t.repos.CreateRefreshToken(userID, refreshToken)
	}
	return t.repos.UpdateRefreshToken(userID, refreshToken)

}

func (t *TokenService) DeleteToken(refreshToken string) error {
	return t.repos.DeleteRefreshToken(refreshToken)
}

func (t *TokenService) ValidateRefresh(refreshToken string) bool {
	_, err := t.ParseToken(refreshToken, signingKeyRefresh)
	return err == nil
}

func (t *TokenService) ValidateAccess(accessToken string) bool {
	_, err := t.ParseToken(accessToken, signingKeyAccess)
	return err != nil
}

func (t *TokenService) FindToken(refreshToken string) (entities.RefreshToken, error) {
	return t.repos.GetRowByRefreshToken(refreshToken)
}

func (t *TokenService) ParseToken(rt, key string) (Payload, error) {
	const op = "service.token.ParseToken"
	token, err := jwt.ParseWithClaims(rt, &tokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(key), nil
	})
	if err != nil {
		return Payload{}, err
	}
	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return Payload{}, errors.New("token claims are not of type *tokenClaims " + op)
	}

	return Payload{PlayerID: claims.PlayerID, Roles: claims.Roles}, nil
}
