package entities

type JoinDto struct {
	Color    string `json:"color"`
	LobbyID  int    `json:"lobby_id"`
	PlayerID int    `json:"player_id"`
}

type UserDto struct {
	User   PlayerInfo        `json:"user"`
	Tokens map[string]string `json:"tokens"`
}
