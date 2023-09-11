import { AxiosPromise } from "axios";
import $api, { API_URL } from "../http/api"
import { Colors } from "../models/chess/Colors";
import { createLobbyResponse, gameInfoResponse } from "../models/response/GameResponse";
import { GameStatus } from "../models/chess/GameStatus";

export default class GameService{
    static async create(hostID : number) : Promise<AxiosPromise<createLobbyResponse>> {
        return $api.post('/lobby/create', {host_id: hostID});
    }

    static async startGame(lobbyID : number) : Promise<any> {
        return $api.post('/lobby/startgame', {lobbyID});
    }

    static async finishGame(lobbyID : number, cause : GameStatus, winnerID : number ) : Promise<any> {
        return $api.post('/lobby/finishgame', {
            lobby_id : lobbyID,
            cause : cause,
            winner_id : winnerID ,
        });
    }

    static async join(lobbyID : number, playerID : number ,color: Colors, ) : Promise<any> {
        return $api.post('/lobby/join', {
            lobby_id: lobbyID,
            color:color,
            player_id: playerID,
        });
    }

    static async getGameInfo(lobbyID : number) : Promise<AxiosPromise<gameInfoResponse>>{
        return $api.get('/lobby/info/' + lobbyID);
    }

    static observe(id : number) : WebSocket{
        return new WebSocket(API_URL + 'lobby/' + id);
    }
}