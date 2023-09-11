package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/torderonex/webchess/server/entities"
	"github.com/torderonex/webchess/server/pkg/postgres"
)

type TokensPostgres struct {
	db *sqlx.DB
}

func NewTokensPostgres(db *sqlx.DB) *TokensPostgres {
	return &TokensPostgres{db: db}
}

func (r *TokensPostgres) CreateRefreshToken(playerID int, token string) error {
	query := fmt.Sprintf("INSERT INTO %s (player_id, refresh_token) values ($1, $2)", postgres.TokensTable)
	_, err := r.db.Exec(query, playerID, token)
	return err
}

func (r *TokensPostgres) GetRefreshToken(playerID int) (string, error) {
	var refreshToken string
	query := fmt.Sprintf("SELECT refresh_token FROM %s WHERE player_id=$1", postgres.TokensTable)
	err := r.db.Get(&refreshToken, query, playerID)
	return refreshToken, err
}

func (r *TokensPostgres) GetRowByRefreshToken(refreshToken string) (entities.RefreshToken, error) {
	var row entities.RefreshToken
	query := fmt.Sprintf("SELECT * FROM %s WHERE refresh_token=$1", postgres.TokensTable)
	err := r.db.Get(&row, query, refreshToken)
	return row, err
}

func (r *TokensPostgres) UpdateRefreshToken(playerID int, refreshToken string) error {
	query := fmt.Sprintf("UPDATE %s SET refresh_token = $1 WHERE player_id = $2", postgres.TokensTable)
	_, err := r.db.Exec(query, refreshToken, playerID)
	return err
}

func (r *TokensPostgres) DeleteRefreshToken(refreshToken string) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE refresh_token=$1", postgres.TokensTable)
	_, err := r.db.Exec(query, refreshToken)
	return err
}
