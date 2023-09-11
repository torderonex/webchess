package service

import (
	"github.com/torderonex/webchess/server/entities"
	"github.com/torderonex/webchess/server/internal/repository"
)

type Service struct {
	Authorization
	Game
	Token
}

type Token interface {
	GenerateTokens(pd Payload) (tokens map[string]string)
	SaveToken(userID int, refreshToken string) error
	DeleteToken(refreshToken string) error
	ValidateRefresh(refreshToken string) bool
	ValidateAccess(accessToken string) bool
	FindToken(refreshToken string) (entities.RefreshToken, error)
	ParseToken(rt, key string) (Payload, error)
}

type Game interface {
	CreateLobby(hostID int) (int, error)
	DeleteLobby(id int) error
	FinishGame(id int, cause string, winnerID int) error
	Join(dto entities.JoinDto) error
	GetGameInfo(id int) (entities.Lobby, error)
	SetBoardState(id int, boardState string) error
	SetCurrentPlayer(id int, color string) error
}

type Mail interface {
	SendConfirmMail(user entities.Player) (string, error)
	SendPasswordResetMail(email string) (string, error)
}

type Authorization interface {
	CreateUser(user entities.Player) (tokens map[string]string, id int, err error)
	Login(user entities.Player) (dto entities.UserDto, err error)
	Logout(refreshToken string) error
	GetUserInfo(id int) (entities.PlayerInfo, error)
	SetActivated(token string) error
	Refresh(refreshToken string) (entities.UserDto, error)
	ResetPassword(email, password string) error
	CheckIdentity(refreshToken string) (Payload, error)
}

func NewService(repos *repository.Repository, config MailConfig) *Service {
	return &Service{
		Authorization: NewAuthService(repos.Authorization, NewTokenService(repos.Tokens), NewMailService(config, repos.Authorization)),
		Game:          NewGameService(repos.Game),
	}
}
