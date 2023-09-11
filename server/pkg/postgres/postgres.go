package postgres

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

const (
	UsersTable  = "users"
	LobbyTable  = "lobbies"
	TokensTable = "tokens"
)

type Config struct {
	Host     string
	Port     string
	Username string
	Password string
	DBName   string
	SSLMode  string
}

func NewPostgresDB(cfg Config) (*sqlx.DB, error) {
	db, err := sqlx.Open("postgres", fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.Username, cfg.Password, cfg.Host, cfg.Port, cfg.DBName, cfg.SSLMode))
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS lobbies(
		id serial primary key,
		host_id int not null ,
		white_id int DEFAULT -1,
		black_id int DEFAULT -1,
		winner_id int DEFAULT -1,
		board_state TEXT,
		current_player varchar(16) DEFAULT 'white',
		created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
		game_status varchar(128) DEFAULT 'not started'
	);`)
	if err != nil {
		return nil, err
	}
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users(
		id serial primary key,
		nickname varchar(128) unique not null,
		email varchar(128) unique not null,
		password_hash varchar(128) not null,
		mmr int default 500,
		roles varchar(128) DEFAULT 'player',
		registration_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
		confirm_token text null
	  );`)
	if err != nil {
		return nil, err
	}
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS tokens
	(
		player_id     int unique not null,
		refresh_token text unique not null
	);`)
	if err != nil {
		return nil, err
	}
	return db, nil
}
