import {Figure, FigureNames} from "./Figure";
import blacklogo from "../assets/black-bishop.png";
import whitelogo from "../assets/white-bishop.png";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import {Board} from "../Board";

export class Bishop extends Figure{

    constructor(color: Colors) {
        super(color, );
        this.logo = color === Colors.BLACK ? blacklogo : whitelogo
        this.name = FigureNames.BISHOP;
    }

    public override canMoveOn( board: Board, target: Cell): boolean {
        if(!super.canMoveOn(board, target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        return board.isEmptyByDiagonal(first,target);
    }

    public override moveRule(board : Board, target : Cell) : boolean {
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        return board.isEmptyByDiagonal(first,target);
    }


    public canAttack(board : Board, target : Cell) : boolean{
        if(!super.canAttack(board, target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        return board.isEmptyByDiagonal(first,target);
    }
}