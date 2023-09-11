import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blacklogo from "../assets/black-rook.png";
import whitelogo from "../assets/white-rook.png";
import { Board } from "../Board";

export class Rook extends Figure {
    constructor(color: Colors) {
        super(color, );
        this.logo = color === Colors.BLACK ? blacklogo : whitelogo;
        this.name = FigureNames.ROOK ;
    }

    public override canMoveOn(board : Board,target: Cell): boolean {
        if(!super.canMoveOn(board ,target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        return board.isEmptyByHorizontal(first,target) || board.isEmptyByVertical(first, target);
    }

    public override moveRule(board : Board, target : Cell) : boolean {
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        return board.isEmptyByHorizontal(first,target) || board.isEmptyByVertical(first, target);
    }

    public canAttack(board : Board, target : Cell) : boolean{
        if(!super.canAttack(board ,target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        return board.isEmptyByHorizontal(first,target) || board.isEmptyByVertical(first, target);
    }

}