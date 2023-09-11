package entities

type Player struct {
	ID               int    `db:"id"`
	Nickname         string `json:"nickname" db:"nickname" validate:"required,max=40"`
	Email            string `json:"email" db:"email" validate:"required,email"`
	Password         string `json:"password" db:"password_hash" validate:"required,min=5,max=30"`
	MMR              int    `json:"mmr" db:"mmr"`
	Roles            string `json:"roles" db:"roles"`
	RegistrationDate string `json:"registration_date" db:"registration_date"`
	ConfirmToken     string `json:"confirm_token" db:"confirm_token"`
}

type PlayerInfo struct {
	ID               int    `db:"id"`
	Nickname         string `json:"nickname" db:"nickname" validate:"required,max=40"`
	Email            string `json:"email" db:"email" validate:"required,email"`
	MMR              int    `json:"mmr" db:"mmr"`
	Roles            string `json:"roles" db:"roles"`
	RegistrationDate string `json:"registration_date" db:"registration_date"`
}

func NewPlayerInfo(player Player) PlayerInfo {
	return PlayerInfo{
		ID:               player.ID,
		Nickname:         player.Nickname,
		Email:            player.Email,
		MMR:              player.MMR,
		Roles:            player.Roles,
		RegistrationDate: player.RegistrationDate,
	}
}
