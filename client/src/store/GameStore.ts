import { makeAutoObservable } from "mobx";
import GameService from "../services/GameService";

class GameStore{
    lobbyID : number | null = null;
    blacPlayer : number | null = null;
    whitePlayer : number | null = null;
    isStarted : boolean = false;
    
    constructor(){
        makeAutoObservable(this);
    }

    setLobbyID(id : number){
        this.lobbyID = id;
    }

    async createLobby(hostID : number){
        try{
            const response = await GameService.create(hostID);
            this.setLobbyID(response.data.lobby_id);
        }catch(e){
            console.log(e);
        }
    }
}