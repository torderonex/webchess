import { Colors } from "../chess/Colors";
import { GameStatus } from "../chess/GameStatus";

export interface createLobbyResponse{
    lobby_id : number;
}

export interface gameInfoResponse{
    id : number
    host_id : number
    white_id : number
    black_id : number
    winner_id : number
    board_state : string
    current_player : Colors
    created_at : string
    game_status : GameStatus
}