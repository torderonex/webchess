package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/torderonex/webchess/server/entities"
	"github.com/torderonex/webchess/server/pkg/postgres"
)

type AuthPostgres struct {
	db *sqlx.DB
}

func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{
		db: db,
	}
}

func (r *AuthPostgres) CreateUser(user entities.Player) (int, error) {
	var id int
	query := fmt.Sprintf("INSERT INTO %s (nickname, email, password_hash, confirm_token) VALUES  ($1, $2, $3, $4) RETURNING id", postgres.UsersTable)
	row := r.db.QueryRow(query, user.Nickname, user.Email, user.Password, user.ConfirmToken)
	if err := row.Scan(&id); err != nil {
		return 0, err
	}
	return id, nil
}

func (r *AuthPostgres) GetUserByEmailNickname(email, nickname string) (entities.Player, error) {
	var player entities.Player
	query := fmt.Sprintf("SELECT * from %s WHERE email=$1 OR nickname=$2", postgres.UsersTable)
	err := r.db.Get(&player, query, email, nickname)
	return player, err
}

func (r *AuthPostgres) GetUser(username, password string) (entities.Player, error) {
	var user entities.Player
	query := fmt.Sprintf("SELECT * FROM %s WHERE nickname=$1 AND password_hash=$2", postgres.UsersTable)
	err := r.db.Get(&user, query, username, password)
	return user, err
}

func (r *AuthPostgres) GetUserByID(id int) (entities.PlayerInfo, error) {
	var user entities.PlayerInfo
	query := fmt.Sprintf("SELECT id, nickname, email, mmr, roles, registration_date FROM %s WHERE id=$1", postgres.UsersTable)
	err := r.db.Get(&user, query, id)
	return user, err
}

func (r *AuthPostgres) SetActivated(token string) error {
	query := fmt.Sprintf("UPDATE %s SET confirm_token = NULL WHERE confirm_token = $1", postgres.UsersTable)
	_, err := r.db.Exec(query, token)
	return err
}
func (r *AuthPostgres) GetConfirmToken(user entities.Player) (string, error) {
	var confirmToken string
	query := fmt.Sprintf("SELECT confirm_token FROM %s WHERE email=$1", postgres.UsersTable)
	err := r.db.Get(&confirmToken, query, user.Email)
	return confirmToken, err
}

func (r *AuthPostgres) DeleteUser(id int) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", postgres.UsersTable)
	_, err := r.db.Exec(query, id)
	return err
}

// todo
func (r *AuthPostgres) ResetPassword(email, password string) error {
	return nil
}
