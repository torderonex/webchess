package entities

type Lobby struct {
	ID            int    `json:"id" db:"id"`
	HostID        int    `json:"host_id" db:"host_id"`
	WhiteID       int    `json:"white_id" db:"white_id"`
	BlackID       int    `json:"black_id" db:"black_id"`
	WinnerID      int    `json:"winner_id" db:"winner_id"`
	BoardState    string `json:"board_state" db:"board_state"`
	CurrentPlayer string `json:"current_player" db:"current_player"`
	CreatedAt     string `json:"created_at" db:"created_at"`
	GameStatus    string `json:"game_status"  db:"game_status"`
}
