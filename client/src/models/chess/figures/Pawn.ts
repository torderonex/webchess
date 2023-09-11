import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blacklogo from "../assets/black-pawn.png";
import whitelogo from "../assets/white-pawn.png";
import { Board } from "../Board";

export class Pawn extends Figure{

    isFirstStep : boolean = true;

    constructor(color: Colors) {
        super(color, );
        this.logo = color === Colors.BLACK ? blacklogo : whitelogo;
        this.name = FigureNames.PAWN;
    }
 
    public override canMoveOn(board : Board, target: Cell): boolean {
        if(!super.canMoveOn(board ,target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        const dx: number = first.x  - target.x;
        const dy: number = first.y - target.y;
        return (target.isEmpty() && this.color === Colors.WHITE && ((this.isFirstStep && dy <= 2 && dy >= 0 && dx === 0) || (dy <= 1 && dy >= 0 && dx === 0)))
          || (target.isEmpty() && this.color === Colors.BLACK && ((this.isFirstStep && dy >= -2 && dy <= 0 && dx === 0) || (dy >= -1 && dy <= 0 && dx === 0)))
          || (target.isEnemy(this) && this.color === Colors.WHITE && (dy <= 1 && dy > 0 && Math.abs(dx) === 1))
          || (target.isEnemy(this) && this.color === Colors.BLACK && (dy >= -1 && dy < 0 && Math.abs(dx) === 1));
    }

    public override moveRule(board : Board, target : Cell) : boolean {
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        const dx: number = first.x  - target.x;
        const dy: number = first.y - target.y;
        return (target.isEmpty() && this.color === Colors.WHITE && ((this.isFirstStep && dy <= 2 && dy >= 0 && dx === 0) || (dy <= 1 && dy >= 0 && dx === 0)))
          || (target.isEmpty() && this.color === Colors.BLACK && ((this.isFirstStep && dy >= -2 && dy <= 0 && dx === 0) || (dy >= -1 && dy <= 0 && dx === 0)))
          || (target.isEnemy(this) && this.color === Colors.WHITE && (dy <= 1 && dy > 0 && Math.abs(dx) === 1))
          || (target.isEnemy(this) && this.color === Colors.BLACK && (dy >= -1 && dy < 0 && Math.abs(dx) === 1));
    }

    public canAttack(board : Board, target : Cell) : boolean{
        if(!super.canAttack(board ,target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        const dx: number = first.x  - target.x;
        const dy: number = first.y - target.y;
        return (this.color === Colors.WHITE && (dy <= 1 && dy > 0 && Math.abs(dx) === 1))
                || (  this.color === Colors.BLACK && (dy >= -1 && dy < 0 && Math.abs(dx) === 1));
    }

}