import React, {useContext, useEffect, useState} from 'react';
import {Board} from "../../models/chess/Board";
import "../../App.css"
import CellComponent from "./CellComponent";
import {Cell} from "../../models/chess/Cell";
import { Colors } from '../../models/chess/Colors';
import { FigureNames } from '../../models/chess/figures/Figure';
import {GameStatus} from '../../models/chess/GameStatus';
import { Player } from '../../models/chess/Player';
import { Context } from '../..';
import { colors } from '@mui/material';
import GameService from '../../services/GameService';

interface BoardComponentProps{
    board : Board;
    setBoard : (board : Board) => void;
    gameStatus : GameStatus;
    setGameStatus : (status : GameStatus) => void;
    ws : WebSocket;
    whitePlayer : Player | null;
    blackPlayer : Player | null;
    currentPlayer : Colors
    changeCurrentPlayer : () => void;
    lobbyID : number
  }

const BoardComponent = ({board , setBoard,gameStatus , setGameStatus, ws, whitePlayer, blackPlayer, currentPlayer, changeCurrentPlayer, lobbyID} : BoardComponentProps) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

    const {store} = useContext(Context)

    function click(target : Cell){
      if (gameStatus === GameStatus.ACTIVE 
      && selectedCell && selectedCell !== target && selectedCell.figure?.canMoveOn(board, target) 
      && selectedCell.figure.color === currentPlayer
      && ((currentPlayer  === Colors.BLACK && blackPlayer?.user.ID === store.user.ID) || (currentPlayer === Colors.WHITE && whitePlayer?.user.ID === store.user.ID))){
          const cell = selectedCell  
          
          //promotion (pawn transformation)
          if (board.isBoardEnd(target,selectedCell.figure.color)){
            if (selectedCell.figure.name === FigureNames.PAWN){
              board.moveFigure(cell,target);
              if (!target.figure){
                return;
              }
              board.promotion(target,target.figure.color)
            }
          }
          //short castling 
          if ((target === board.getCell(6,7)) && board.canCastling(board.getCell(4,7),board.getCell(7,7),Colors.WHITE))
            board.shortCastling(Colors.WHITE);
          else if (target === board.getCell(6,0) && board.canCastling(board.getCell(4,0),board.getCell(7,0),Colors.BLACK))
            board.shortCastling(Colors.BLACK);
          //long castling
          else if (target === board.getCell(2,7) && board.canCastling(board.getCell(0,7),board.getCell(4,7),Colors.WHITE))
            board.longCastling(Colors.WHITE);
          else if (target === board.getCell(2,0) && board.canCastling(board.getCell(0,0), board.getCell(4,0),Colors.BLACK))      
            board.longCastling(Colors.BLACK);
          else
            board.moveFigure(cell ,target);
          setSelectedCell(null);
          updateBoard();
          if (ws.readyState === ws.OPEN){
            const wsMsg = {
              option: "board_state",
              msg : JSON.stringify(board, (key, value) => {
                if (key === "logo")
                  return undefined;
                return value;
              })
            }
            ws.send(JSON.stringify(wsMsg))
            ws.send(JSON.stringify({
              option:"current_player",
              msg: currentPlayer === Colors.BLACK ? Colors.WHITE : Colors.BLACK
            }))
          }
          changeCurrentPlayer();
        }else{
            setSelectedCell(target);
        }
    }

    useEffect(()=>{
      updateBoard()
  },
  [selectedCell]);

    function updateBoard() {
        if((board.isCheckmate(Colors.BLACK) || board.isCheckmate(Colors.WHITE)) && gameStatus !== GameStatus.CHECKMATE){
          if (blackPlayer?.user.ID !== whitePlayer?.user.ID){
          if (board.isCheckmate(Colors.BLACK) ){
            const winnderID = whitePlayer?.user.ID || -1
            GameService.finishGame(lobbyID,GameStatus.CHECKMATE, winnderID)     
          }
          if(board.isCheckmate(Colors.WHITE)){
            const winnderID = blackPlayer?.user.ID || -1
            GameService.finishGame(lobbyID,GameStatus.CHECKMATE, winnderID)     

          }
          }
          setGameStatus(GameStatus.CHECKMATE);
        }
        if(board.isStalemate(Colors.BLACK) || board.isStalemate(Colors.WHITE)){
          GameService.finishGame(lobbyID, GameStatus.STALEMATE, -1)     
          setGameStatus(GameStatus.STALEMATE);
        }
        const newBoard = board.getCopyBoard();
        newBoard.highlightCells(selectedCell);
        setBoard(newBoard);
        
    }

    return (
      <>
      <div className="board">
          {board.cells.map((row, index) =>
            <React.Fragment key={index}>
                {row.map(cell =>
                  <CellComponent
                    cell={cell}
                    click={click}
                    selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                    key={Math.random()}
                  />
                )}
            </React.Fragment>
          )}
        </div>
      </>
        

    );
};

export default BoardComponent;
