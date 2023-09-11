import { FC, useContext, useEffect, useState } from 'react';
import { Typography, Grid, Button, Card, CardContent} from '@mui/material';
import { Board } from '../models/chess/Board';
import BoardComponent from '../components/chess/BoardComponent';
import { GameStatus } from '../models/chess/GameStatus';
import { useParams } from 'react-router-dom';
import GameService from '../services/GameService';
import NotFoundPage from './NotFoundPage';
import { Colors } from '../models/chess/Colors';
import { Context } from '..';
import { Player } from '../models/chess/Player';
import UserService from '../services/UserService';
import MySnackbar from '../components/Snackbar';

const GamePage: FC = () => {
  const [board, setBoard] = useState(new Board());
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NOTSTARTED);
  const [whitePlayer, setWhitePlayer] = useState<Player | null>(null);
  const [blackPlayer, setBlackPlayer] = useState<Player | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Colors>(Colors.WHITE);

  const [errorOpen, setErrorOpen] = useState<boolean>(false);

  const {id} = useParams();
  
  const {store} = useContext(Context)

  const ws = new WebSocket('ws://localhost:8080/observe/' + id);
 
  useEffect(() => {
    const fetchData = async () => {
      getGameInfo(); 
      observe();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (whitePlayer !== null && blackPlayer !== null) {
      setGameStatus(GameStatus.ACTIVE);
    }
  }, [whitePlayer, blackPlayer]);

  if (id === undefined){
    return <NotFoundPage></NotFoundPage>
  }

const observe = () => {
    ws.onopen = () =>{
      console.log("ws connection estabilished")
    }

    ws.onmessage = async (message) => {
      const obj = JSON.parse(message.data);
      switch (obj.option){
      case "board_state":
        setBoard(Board.fromJSON((obj.msg)));
        break;
      case "current_player":
        setCurrentPlayer(obj.msg);
        break;
      case "player_pick":
        const joinDTO = JSON.parse(obj.msg);
        if (joinDTO.color === Colors.BLACK){
          const resp = await UserService.getUserInfo(joinDTO.player_id);
          const newPlayer = new Player(resp.data, joinDTO.color)
          setBlackPlayer(newPlayer);
        }else{
          const resp = await UserService.getUserInfo(joinDTO.player_id)
          const newPlayer = new Player(resp.data, joinDTO.color)
          setWhitePlayer(newPlayer)
        }
      }

    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setErrorOpen(true);
    };

    ws.onclose = () => {
      setErrorOpen(true);
      console.log('WebSocket connection closed.');
    };
  }
  const changeCurrentPlayer = () =>{
    if (currentPlayer === Colors.WHITE){
      setCurrentPlayer(Colors.BLACK);
      return
    }
    setCurrentPlayer(Colors.WHITE);
  }

  const getGameInfo = async () => {
    const resp = await GameService.getGameInfo(parseInt(id));
    setBoard(Board.fromJSON(resp.data.board_state))
    
    setGameStatus(resp.data.game_status);

    if(resp.data.white_id !== -1){
      const userInfoResp = await UserService.getUserInfo(resp.data.white_id);
      setWhitePlayer(new Player(userInfoResp.data,Colors.WHITE))
    }if (resp.data.black_id !== -1){
      const userInfoResp = await UserService.getUserInfo(resp.data.black_id);
      setBlackPlayer(new Player(userInfoResp.data,Colors.BLACK))
    }
    setCurrentPlayer(resp.data.current_player);
  }

  const joinToGame = async (lobbyID : number, playerID : number, color : Colors) =>{
    try{
      const resp = await GameService.join(lobbyID,playerID, color)
      if (resp.status == 200){
        if(color === Colors.BLACK){
          setBlackPlayer(new Player(store.user,color));
        }else{
          setWhitePlayer(new Player(store.user,color));
        }
      }else{
        console.log("side selection error")
      }
    }catch(e){
      console.log(e)
    }
  }

  const handleSideSelection = async (side: Colors) =>{
    if(!store.isAuth){
      console.log("пользователь не может выбрать сторону так как он не авторизован")
      return
    }
    const joinDTO = {
      lobby_id : parseInt(id),
      player_id : store.user.ID,
      color : side
    }
    await joinToGame(joinDTO.lobby_id,store.user.ID, side)
    if(ws.readyState === ws.OPEN){
      ws.send(JSON.stringify({
        option:"player_pick",
        msg: JSON.stringify(joinDTO)
      }))
    }
  }

  return (
    <Grid container alignItems="center" style={{ height: '80vh', display: 'flex', justifyContent: 'center' }}>
      {/* Board */}
      <Grid item xs={12} md={6} container justifyContent="center">
        <BoardComponent ws={ws} gameStatus={gameStatus} setGameStatus={setGameStatus} board={board} setBoard={setBoard} whitePlayer={whitePlayer} blackPlayer={blackPlayer} currentPlayer={currentPlayer} changeCurrentPlayer={changeCurrentPlayer} lobbyID={parseInt(id)} />
      </Grid>

      {/* Side selection and game status */}
      <Grid item xs={12} md={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card style={{ width: '30%', height: '100%' }}>
          <CardContent>
            {/* Side Selection Buttons */}
            {!whitePlayer && (
              <Button
                variant="outlined"
                onClick={() => handleSideSelection(Colors.WHITE)}
              >
                White
              </Button>
            )}
            {
              whitePlayer && (
                <Typography>{whitePlayer.user.nickname} | {whitePlayer.user.mmr} mmr</Typography>
              )
            }
            {/* Game Status */}
            <Typography style={{marginTop:"10px", marginBottom:"10px"}}>Game status: {gameStatus}</Typography>
            {!blackPlayer && (
              <Button
                variant="outlined"
                onClick={() => handleSideSelection(Colors.BLACK)}
              >
                Black
              </Button>
            )}
            {
              blackPlayer && (
                <Typography>{blackPlayer.user.nickname} | {blackPlayer.user.mmr} mmr</Typography>
              )
            }
          </CardContent>
        </Card>
      </Grid>

      <MySnackbar handleClose={() => setErrorOpen(false)} open={errorOpen} severity='error'  msg="Error: connection error. Try to reload page" />

    </Grid>
  );
};

export default GamePage;
