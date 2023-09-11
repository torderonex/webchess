import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blacklogo from "../assets/black-knight.png";
import whitelogo from "../assets/white-knight.png";
import { Board } from "../Board";

export class Knight extends Figure{
    constructor(color: Colors) {
        super(color, );
        this.logo = color === Colors.BLACK ? blacklogo : whitelogo;
        this.name = FigureNames.KNIGHT;
    }

    public override canMoveOn( board: Board, target: Cell): boolean {
        if(!super.canMoveOn(board, target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        const dx: number = Math.abs(first.x  - target.x);
        const dy: number = Math.abs(first.y - target.y);
        return (dy === 1 && dx === 2) || (dy === 2 && dx === 1);
    }

    public override moveRule(board : Board, target : Cell) : boolean {
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        const dx: number = Math.abs(first.x  - target.x);
        const dy: number = Math.abs(first.y - target.y);
        return (dy === 1 && dx === 2) || (dy === 2 && dx === 1);
    }

    public canAttack(board : Board, target : Cell) : boolean{
        if(!super.canAttack(board, target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        const dx: number = Math.abs(first.x  - target.x);
        const dy: number = Math.abs(first.y - target.y);
        return (dy === 1 && dx === 2) || (dy === 2 && dx === 1);
    }
}