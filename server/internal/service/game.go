package service

import (
	"errors"
	"github.com/torderonex/webchess/server/entities"
	"github.com/torderonex/webchess/server/internal/repository"
)

type GameService struct {
	repos repository.Game
}

const initialBoardState = "{\"cells\":[[{\"color\":\"white\",\"x\":0,\"y\":0,\"figure\":{\"color\":\"black\",\"name\":\"Ладья\",\"id\":0.05163759672549828,\"isFirstStep\":true},\"id\":0.7188061148940605,\"available\":false},{\"color\":\"black\",\"x\":1,\"y\":0,\"figure\":{\"color\":\"black\",\"name\":\"Конь\",\"id\":0.628899077616174,\"isFirstStep\":true},\"id\":0.6690764680746151,\"available\":false},{\"color\":\"white\",\"x\":2,\"y\":0,\"figure\":{\"color\":\"black\",\"name\":\"Слон\",\"id\":0.16077985976302345,\"isFirstStep\":true},\"id\":0.971777071967816,\"available\":false},{\"color\":\"black\",\"x\":3,\"y\":0,\"figure\":{\"color\":\"black\",\"name\":\"Ферзь\",\"id\":0.7067453141781264,\"isFirstStep\":true},\"id\":0.0316807458055659,\"available\":false},{\"color\":\"white\",\"x\":4,\"y\":0,\"figure\":{\"color\":\"black\",\"name\":\"Король\",\"id\":0.14419916077816763,\"isFirstStep\":true},\"id\":0.8761148529942144,\"available\":false},{\"color\":\"black\",\"x\":5,\"y\":0,\"figure\":{\"color\":\"black\",\"name\":\"Слон\",\"id\":0.28058752392741715,\"isFirstStep\":true},\"id\":0.8204615387887411,\"available\":false},{\"color\":\"white\",\"x\":6,\"y\":0,\"figure\":{\"color\":\"black\",\"name\":\"Конь\",\"id\":0.13117827129144755,\"isFirstStep\":true},\"id\":0.08500363282292533,\"available\":false},{\"color\":\"black\",\"x\":7,\"y\":0,\"figure\":{\"color\":\"black\",\"name\":\"Ладья\",\"id\":0.4717005802000027,\"isFirstStep\":true},\"id\":0.494966474124259,\"available\":false}],[{\"color\":\"black\",\"x\":0,\"y\":1,\"figure\":{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.8126613555524222,\"isFirstStep\":true},\"id\":0.03005926905655265,\"available\":false},{\"color\":\"white\",\"x\":1,\"y\":1,\"figure\":{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.8356564593795264,\"isFirstStep\":true},\"id\":0.8552859592961142,\"available\":false},{\"color\":\"black\",\"x\":2,\"y\":1,\"figure\":{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.5810777091614199,\"isFirstStep\":true},\"id\":0.34536165239843797,\"available\":false},{\"color\":\"white\",\"x\":3,\"y\":1,\"figure\":{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.5151891253166616,\"isFirstStep\":true},\"id\":0.4023246636559523,\"available\":false},{\"color\":\"black\",\"x\":4,\"y\":1,\"figure\":{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.9524392849142984,\"isFirstStep\":true},\"id\":0.45100656798255323,\"available\":false},{\"color\":\"white\",\"x\":5,\"y\":1,\"figure\":{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.7622381221045718,\"isFirstStep\":true},\"id\":0.8136049237872811,\"available\":false},{\"color\":\"black\",\"x\":6,\"y\":1,\"figure\":{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.3204394149237406,\"isFirstStep\":true},\"id\":0.7209407220116228,\"available\":false},{\"color\":\"white\",\"x\":7,\"y\":1,\"figure\":{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.9235045042688488,\"isFirstStep\":true},\"id\":0.8199762968255904,\"available\":false}],[{\"color\":\"white\",\"x\":0,\"y\":2,\"figure\":null,\"id\":0.7086243462076032,\"available\":false},{\"color\":\"black\",\"x\":1,\"y\":2,\"figure\":null,\"id\":0.7853017661403496,\"available\":false},{\"color\":\"white\",\"x\":2,\"y\":2,\"figure\":null,\"id\":0.43189264225899215,\"available\":false},{\"color\":\"black\",\"x\":3,\"y\":2,\"figure\":null,\"id\":0.07136699085144294,\"available\":false},{\"color\":\"white\",\"x\":4,\"y\":2,\"figure\":null,\"id\":0.8520447792438575,\"available\":false},{\"color\":\"black\",\"x\":5,\"y\":2,\"figure\":null,\"id\":0.057260963575143986,\"available\":false},{\"color\":\"white\",\"x\":6,\"y\":2,\"figure\":null,\"id\":0.0028399024400527217,\"available\":false},{\"color\":\"black\",\"x\":7,\"y\":2,\"figure\":null,\"id\":0.575187517878931,\"available\":false}],[{\"color\":\"black\",\"x\":0,\"y\":3,\"figure\":null,\"id\":0.9149866670954445,\"available\":false},{\"color\":\"white\",\"x\":1,\"y\":3,\"figure\":null,\"id\":0.30518951599372524,\"available\":false},{\"color\":\"black\",\"x\":2,\"y\":3,\"figure\":null,\"id\":0.8552755708505122,\"available\":false},{\"color\":\"white\",\"x\":3,\"y\":3,\"figure\":null,\"id\":0.7147506634539449,\"available\":false},{\"color\":\"black\",\"x\":4,\"y\":3,\"figure\":null,\"id\":0.0819082823535835,\"available\":false},{\"color\":\"white\",\"x\":5,\"y\":3,\"figure\":null,\"id\":0.956420819671117,\"available\":false},{\"color\":\"black\",\"x\":6,\"y\":3,\"figure\":null,\"id\":0.6541530226075805,\"available\":false},{\"color\":\"white\",\"x\":7,\"y\":3,\"figure\":null,\"id\":0.15896159180727776,\"available\":false}],[{\"color\":\"white\",\"x\":0,\"y\":4,\"figure\":null,\"id\":0.7652844545351558,\"available\":false},{\"color\":\"black\",\"x\":1,\"y\":4,\"figure\":null,\"id\":0.7470412647352827,\"available\":false},{\"color\":\"white\",\"x\":2,\"y\":4,\"figure\":null,\"id\":0.46422851551351396,\"available\":false},{\"color\":\"black\",\"x\":3,\"y\":4,\"figure\":null,\"id\":0.17624496154838876,\"available\":false},{\"color\":\"white\",\"x\":4,\"y\":4,\"figure\":null,\"id\":0.793403096885577,\"available\":false},{\"color\":\"black\",\"x\":5,\"y\":4,\"figure\":null,\"id\":0.28151663303127705,\"available\":false},{\"color\":\"white\",\"x\":6,\"y\":4,\"figure\":null,\"id\":0.05367774455337537,\"available\":false},{\"color\":\"black\",\"x\":7,\"y\":4,\"figure\":null,\"id\":0.5396626962098952,\"available\":false}],[{\"color\":\"black\",\"x\":0,\"y\":5,\"figure\":null,\"id\":0.14263089145549768,\"available\":false},{\"color\":\"white\",\"x\":1,\"y\":5,\"figure\":null,\"id\":0.92301681774304,\"available\":false},{\"color\":\"black\",\"x\":2,\"y\":5,\"figure\":null,\"id\":0.35727948869940973,\"available\":false},{\"color\":\"white\",\"x\":3,\"y\":5,\"figure\":null,\"id\":0.5145334249906615,\"available\":false},{\"color\":\"black\",\"x\":4,\"y\":5,\"figure\":null,\"id\":0.49463279844883523,\"available\":false},{\"color\":\"white\",\"x\":5,\"y\":5,\"figure\":null,\"id\":0.9435326459565625,\"available\":false},{\"color\":\"black\",\"x\":6,\"y\":5,\"figure\":null,\"id\":0.9557911757594337,\"available\":false},{\"color\":\"white\",\"x\":7,\"y\":5,\"figure\":null,\"id\":0.5040126462174301,\"available\":false}],[{\"color\":\"white\",\"x\":0,\"y\":6,\"figure\":{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.4384100019125923,\"isFirstStep\":true},\"id\":0.7017113892564129,\"available\":false},{\"color\":\"black\",\"x\":1,\"y\":6,\"figure\":{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.37317502236328814,\"isFirstStep\":true},\"id\":0.3151563862551059,\"available\":false},{\"color\":\"white\",\"x\":2,\"y\":6,\"figure\":{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.5355886529829716,\"isFirstStep\":true},\"id\":0.5761684702938099,\"available\":false},{\"color\":\"black\",\"x\":3,\"y\":6,\"figure\":{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.7426839717076457,\"isFirstStep\":true},\"id\":0.769560101820999,\"available\":false},{\"color\":\"white\",\"x\":4,\"y\":6,\"figure\":{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.9996804828273249,\"isFirstStep\":true},\"id\":0.40863242693407353,\"available\":false},{\"color\":\"black\",\"x\":5,\"y\":6,\"figure\":{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.19755662155883646,\"isFirstStep\":true},\"id\":0.4559404669072582,\"available\":false},{\"color\":\"white\",\"x\":6,\"y\":6,\"figure\":{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.9830208547576986,\"isFirstStep\":true},\"id\":0.6154779799605361,\"available\":false},{\"color\":\"black\",\"x\":7,\"y\":6,\"figure\":{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.6014593309750855,\"isFirstStep\":true},\"id\":0.791507141474016,\"available\":false}],[{\"color\":\"black\",\"x\":0,\"y\":7,\"figure\":{\"color\":\"white\",\"name\":\"Ладья\",\"id\":0.18606655036903264,\"isFirstStep\":true},\"id\":0.13970916947448608,\"available\":false},{\"color\":\"white\",\"x\":1,\"y\":7,\"figure\":{\"color\":\"white\",\"name\":\"Конь\",\"id\":0.810176766500488,\"isFirstStep\":true},\"id\":0.5871909256995658,\"available\":false},{\"color\":\"black\",\"x\":2,\"y\":7,\"figure\":{\"color\":\"white\",\"name\":\"Слон\",\"id\":0.681070894306387,\"isFirstStep\":true},\"id\":0.6645347026923698,\"available\":false},{\"color\":\"white\",\"x\":3,\"y\":7,\"figure\":{\"color\":\"white\",\"name\":\"Ферзь\",\"id\":0.2158522589146914,\"isFirstStep\":true},\"id\":0.8616723869241059,\"available\":false},{\"color\":\"black\",\"x\":4,\"y\":7,\"figure\":{\"color\":\"white\",\"name\":\"Король\",\"id\":0.14539817295016988,\"isFirstStep\":true},\"id\":0.6141551638447946,\"available\":false},{\"color\":\"white\",\"x\":5,\"y\":7,\"figure\":{\"color\":\"white\",\"name\":\"Слон\",\"id\":0.49914581620815013,\"isFirstStep\":true},\"id\":0.5357742051266245,\"available\":false},{\"color\":\"black\",\"x\":6,\"y\":7,\"figure\":{\"color\":\"white\",\"name\":\"Конь\",\"id\":0.8185385761181692,\"isFirstStep\":true},\"id\":0.3531638749295989,\"available\":false},{\"color\":\"white\",\"x\":7,\"y\":7,\"figure\":{\"color\":\"white\",\"name\":\"Ладья\",\"id\":0.2621635294023976,\"isFirstStep\":true},\"id\":0.023609379909708128,\"available\":false}]],\"gameStatus\":\"active\",\"blackFigures\":[{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.8126613555524222,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.8356564593795264,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.5810777091614199,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.5151891253166616,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.9524392849142984,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.7622381221045718,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.3204394149237406,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Пешка\",\"id\":0.9235045042688488,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Конь\",\"id\":0.628899077616174,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Конь\",\"id\":0.13117827129144755,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Король\",\"id\":0.14419916077816763,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Слон\",\"id\":0.16077985976302345,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Слон\",\"id\":0.28058752392741715,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Ферзь\",\"id\":0.7067453141781264,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Ладья\",\"id\":0.05163759672549828,\"isFirstStep\":true},{\"color\":\"black\",\"name\":\"Ладья\",\"id\":0.4717005802000027,\"isFirstStep\":true}],\"whiteFigures\":[{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.4384100019125923,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.37317502236328814,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.5355886529829716,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.7426839717076457,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.9996804828273249,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.19755662155883646,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.9830208547576986,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Пешка\",\"id\":0.6014593309750855,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Конь\",\"id\":0.810176766500488,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Конь\",\"id\":0.8185385761181692,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Король\",\"id\":0.14539817295016988,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Слон\",\"id\":0.681070894306387,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Слон\",\"id\":0.49914581620815013,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Ферзь\",\"id\":0.2158522589146914,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Ладья\",\"id\":0.18606655036903264,\"isFirstStep\":true},{\"color\":\"white\",\"name\":\"Ладья\",\"id\":0.2621635294023976,\"isFirstStep\":true}],\"blackKing\":{\"color\":\"black\",\"name\":\"Король\",\"id\":0.14419916077816763,\"isFirstStep\":true},\"whiteKing\":{\"color\":\"white\",\"name\":\"Король\",\"id\":0.14539817295016988,\"isFirstStep\":true}}"

const black = "black"
const white = "white"

const activeStatus = "active"

func NewGameService(repos repository.Game) *GameService {
	return &GameService{
		repos: repos,
	}
}

func (s *GameService) CreateLobby(hostID int) (int, error) {
	lobbyID, err := s.repos.CreateLobby(entities.Lobby{HostID: hostID})
	if err != nil {
		return -1, err
	}
	return lobbyID, s.repos.UpdateBoardState(lobbyID, initialBoardState)
}
func (s *GameService) DeleteLobby(id int) error {
	return s.repos.DeleteLobby(id)
}

func (s *GameService) SetBoardState(id int, boardState string) error {
	return s.repos.UpdateBoardState(id, boardState)
}

func (s *GameService) FinishGame(id int, cause string, winnerID int) error {
	const op = "service.game.FinishGame"
	gameInfo, err := s.repos.GetGameInfo(id)
	if err != nil {
		return errors.New(err.Error() + op)
	}
	var loserID int
	if gameInfo.BlackID == winnerID {
		loserID = gameInfo.WhiteID
	} else {
		loserID = gameInfo.BlackID
	}
	if winnerID != -1 && cause != "stalemate" && gameInfo.BlackID != gameInfo.WhiteID {
		if err := s.repos.SetWinner(id, winnerID); err != nil {
			return errors.New(err.Error() + op)
		}
		if err := s.repos.SetRating(winnerID, 25); err != nil {
			return errors.New(err.Error() + op)
		}
		if err := s.repos.SetRating(loserID, -25); err != nil {
			return errors.New(err.Error() + op)
		}
	}
	if err := s.repos.SetGameStatus(id, cause); err != nil {
		return errors.New(err.Error() + op)
	}
	return nil
}

func (s *GameService) Join(dto entities.JoinDto) error {
	const op = "service.game.Join"
	info, err := s.repos.GetGameInfo(dto.LobbyID)
	if err != nil {
		return errors.New(err.Error() + op)
	}
	if (dto.Color == black && info.WhiteID != -1) || (dto.Color == white && info.BlackID != -1) {
		if err := s.repos.SetGameStatus(dto.LobbyID, activeStatus); err != nil {
			return errors.New(err.Error() + op)
		}
	}
	err = s.repos.SetPlayer(dto.LobbyID, dto.PlayerID, dto.Color)
	if err != nil {
		return errors.New(err.Error() + op)
	}
	return nil
}

func (s *GameService) GetGameInfo(id int) (entities.Lobby, error) {
	gameInfo, err := s.repos.GetGameInfo(id)
	return gameInfo, err

}

func (s *GameService) SetCurrentPlayer(id int, color string) error {
	return s.repos.SetCurrentPlayer(id, color)
}
