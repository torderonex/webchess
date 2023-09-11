import {Figure, FigureNames} from "./Figure";
import {Board} from "../Board"
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blacklogo from "../assets/black-queen.png";
import whitelogo from "../assets/white-queen.png";

export class Queen extends Figure{
    constructor(color: Colors) {
        super(color, );
        this.logo = color === Colors.BLACK ? blacklogo : whitelogo;
        this.name = FigureNames.QUEEN;
    }

    public override canMoveOn( board: Board, target: Cell): boolean {
        if(!super.canMoveOn(board, target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        return board.isEmptyByVertical(first,target) || board.isEmptyByHorizontal(first,target) || board.isEmptyByDiagonal(first,target);
        
    }

    public override moveRule(board : Board, target : Cell) : boolean {
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        return board.isEmptyByVertical(first,target) || board.isEmptyByHorizontal(first,target) || board.isEmptyByDiagonal(first,target);
    }

    public canAttack(board : Board, target : Cell) : boolean{
        if(!super.canAttack(board, target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        return board.isEmptyByVertical(first,target) || board.isEmptyByHorizontal(first,target) || board.isEmptyByDiagonal(first,target);
    }
}