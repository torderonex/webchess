import {Colors} from "../Colors";
import logo from "../assets/black-bishop.png"
import {Cell} from "../Cell";
import {Board} from "../Board";

export enum FigureNames {
    FIGURE = "Фигура",
    KING = "Король",
    KNIGHT = "Конь",
    PAWN = "Пешка",
    QUEEN = "Ферзь",
    ROOK = "Ладья",
    BISHOP = "Слон",
}

export class Figure{
    color: Colors;
    logo: typeof logo | null;
    name: FigureNames;
    id: number;
    isFirstStep : boolean;

    constructor(color: Colors) {
        this.color = color;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.id = Math.random();
        this.isFirstStep = true;
    }

    // canMoveOn(target :Cell) : boolean{
    //     if (target.figure?.color === this.color){
    //         return false;
    //     }
    //     const temp : Board = this.cell.board.getCopyDeepBoard();
    //     console.log(temp.getKing(Colors.BLACK))
    //     temp.getCell(this.cell.x,this.cell.y).mustMoveFigure(temp.getCell(target.x,target.y))
    //
    //     //if (temp.getKing(this.color)?.isUnderAttack()){
    //       //  console.log("hello")
    //         //return false;
    //     //}
    //     return target.figure?.name !== FigureNames.KING;
    //
    // }

    

    canMoveOn(board : Board,target: Cell) : boolean{
        if(target.figure?.color === this.color){
            return false;
        }
        if(target.figure?.name === FigureNames.KING){
            return false;
        }
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){
            return false;
        }
        
        //cant move if king will be under attack 
        const tempBoard = board.getDeepCopyBoard();
        const tempFirst : Cell | null = tempBoard.getCell(first.x,first.y)
        const king = this.color === Colors.WHITE ? tempBoard.whiteKing : tempBoard.blackKing;
        tempBoard.moveFigure(tempFirst,tempBoard.getCell(target.x,target.y));
        
        return !(tempBoard.getFigurePosition(king)?.isUnderAttack(tempBoard,this.color));
    }

    public canAttack(board : Board, target : Cell) : boolean{
        return target.figure?.color !== this.color
    }

    moveRule (board : Board, target : Cell) : boolean{
        return true;   
    }

    moveFigure() {
        this.isFirstStep = false;
    }

}
