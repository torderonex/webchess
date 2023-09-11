package repository

import (
	"github.com/jmoiron/sqlx"
	"github.com/torderonex/webchess/server/entities"
)

type Authorization interface {
	CreateUser(user entities.Player) (int, error)
	GetUser(username, password string) (entities.Player, error)
	SetActivated(token string) error
	GetConfirmToken(user entities.Player) (string, error)
	ResetPassword(email, password string) error
	GetUserByID(id int) (entities.PlayerInfo, error)
	DeleteUser(id int) error
}

type Tokens interface {
	CreateRefreshToken(playerID int, token string) error
	GetRefreshToken(playerID int) (string, error)
	UpdateRefreshToken(playerID int, refreshToken string) error
	DeleteRefreshToken(refreshToken string) error
	GetRowByRefreshToken(refreshToken string) (entities.RefreshToken, error)
}

type Game interface {
	SetRating(playerID, count int) error
	CreateLobby(lobby entities.Lobby) (int, error)
	DeleteLobby(id int) error
	GetLobby(id int) (entities.Lobby, error)
	SetPlayer(lobbyID, playerID int, color string) error
	SetWinner(lobbyID, id int) error
	UpdateBoardState(id int, board string) error
	GetBoard(id int) (string, error)
	SetGameStatus(id int, status string) error
	GetGameInfo(id int) (entities.Lobby, error)
	SetGameInfo(id int, lobby entities.Lobby) error
	SetCurrentPlayer(lobbyID int, color string) error
}

type Repository struct {
	Authorization
	Game
	Tokens
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Authorization: NewAuthPostgres(db),
		Game:          NewLobbyPostgres(db),
		Tokens:        NewTokensPostgres(db),
	}
}
