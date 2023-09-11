package repository

import (
	"errors"
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/torderonex/webchess/server/entities"
	"github.com/torderonex/webchess/server/pkg/postgres"
)

type lobbyPostgres struct {
	db *sqlx.DB
}

func NewLobbyPostgres(db *sqlx.DB) *lobbyPostgres {
	return &lobbyPostgres{
		db: db,
	}
}

func (l *lobbyPostgres) CreateLobby(lobby entities.Lobby) (int, error) {
	var id int
	query := fmt.Sprintf("INSERT INTO %s (host_id) values ($1) RETURNING id", postgres.LobbyTable)
	row := l.db.QueryRow(query, lobby.HostID)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}
	return id, nil
}

func (l *lobbyPostgres) DeleteLobby(id int) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1", postgres.LobbyTable)
	_, err := l.db.Exec(query, id)
	return err
}

func (l *lobbyPostgres) GetLobby(id int) (entities.Lobby, error) {
	var lobby entities.Lobby
	query := fmt.Sprintf("SELECT * FROM %s WHERE id = $1", postgres.LobbyTable)
	err := l.db.Get(&lobby, query, id)
	return lobby, err
}

func (l *lobbyPostgres) SetWinner(lobbyID, id int) error {
	query := fmt.Sprintf("UPDATE %s SET winner_id = $1 WHERE id = $2", postgres.LobbyTable)
	_, err := l.db.Exec(query, id, lobbyID)
	return err
}

func (l *lobbyPostgres) UpdateBoardState(id int, board string) error {
	query := fmt.Sprintf("UPDATE %s SET board_state = $1 WHERE id = $2", postgres.LobbyTable)
	_, err := l.db.Exec(query, board, id)
	return err
}

func (l *lobbyPostgres) GetBoard(id int) (string, error) {
	var boardState string
	query := fmt.Sprintf("SELECT board_state FROM %s WHERE id = $1", postgres.LobbyTable)
	err := l.db.Get(&boardState, query, id)
	return boardState, err
}

func (l *lobbyPostgres) getGameStatus(id int) (string, error) {
	var status string
	query := fmt.Sprintf("SELECT game_status FROM %s WHERE id = $1", postgres.LobbyTable)
	err := l.db.Get(&status, query, id)
	return status, err
}

func (l *lobbyPostgres) SetPlayer(lobbyID, playerID int, color string) error {
	if color != "black" && color != "white" {
		return errors.New("wrong color")
	}
	player := color + "_id"
	query := fmt.Sprintf("UPDATE %s SET %s=$1 WHERE id=$2", postgres.LobbyTable, player)
	_, err := l.db.Exec(query, playerID, lobbyID)
	return err
}

func (l *lobbyPostgres) SetGameStatus(id int, status string) error {
	query := fmt.Sprintf("UPDATE %s SET game_status = $1 WHERE id = $2", postgres.LobbyTable)
	_, err := l.db.Exec(query, status, id)
	return err
}

func (l *lobbyPostgres) GetGameInfo(id int) (entities.Lobby, error) {
	var gameInfo entities.Lobby
	query := fmt.Sprintf("SELECT * FROM %s WHERE id=$1", postgres.LobbyTable)
	err := l.db.Get(&gameInfo, query, id)
	return gameInfo, err
}

func (l *lobbyPostgres) SetGameInfo(id int, lobby entities.Lobby) error {
	query := fmt.Sprintf(`UPDATE %s
						SET 
							white_id = $1,
							black_id = $2,
							winner_id = $3,
							board_state = $4,
							current_player = $5,
							game_status = $6
						WHERE
							id = $7;
				`, postgres.LobbyTable)
	_, err := l.db.Exec(query, lobby.WhiteID, lobby.BlackID, lobby.WinnerID, lobby.BoardState, lobby.CurrentPlayer, lobby.GameStatus, id)
	return err
}

func (l *lobbyPostgres) SetRating(playerID, count int) error {
	query := fmt.Sprintf("UPDATE %s SET mmr = mmr + %d WHERE id = $1 ", postgres.UsersTable, count)
	_, err := l.db.Exec(query, playerID)
	return err
}

func (l *lobbyPostgres) SetCurrentPlayer(lobbyID int, color string) error {
	query := fmt.Sprintf("UPDATE %s SET current_player = $1 WHERE id = $2", postgres.LobbyTable)
	_, err := l.db.Exec(query, color, lobbyID)
	return err
}
