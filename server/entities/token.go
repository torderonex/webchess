package entities

type RefreshToken struct {
	PlayerID int    `db:"player_id"`
	Token    string `db:"refresh_token"`
}
