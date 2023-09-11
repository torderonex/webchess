import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blacklogo from "../assets/black-king.png";
import whitelogo from "../assets/white-king.png";
import { Board } from "../Board";

export class King  extends Figure{
    constructor(color: Colors) {
        super(color, );
        this.logo = color === Colors.BLACK ? blacklogo : whitelogo;
        this.name = FigureNames.KING;
    }

    public override canMoveOn(board : Board,target: Cell): boolean {
        if(!super.canMoveOn(board ,target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        if(target.isUnderAttack(board,this.color)){return false;}
        
        //short castling for white
        if (target === board.getCell(6,7) && board.canCastling(first,board.getCell(7,7), this.color)){return true};
        //short castling for black
        if (target === board.getCell(6,0) && board.canCastling(first,board.getCell(7,0), this.color)){return true};
        //long castling for white
        if (target === board.getCell(2,7) && board.canCastling(board.getCell(0,7),first, this.color)){return true};
        //long castling for black
        if (target === board.getCell(2,0) && board.canCastling(board.getCell(0,0),first, this.color)){return true};

        const dx: number = Math.abs(first.x  - target.x);
        const dy: number = Math.abs(first.y - target.y);
        return dy <= 1 && dx <= 1;
    }

    public override moveRule(board : Board, target : Cell) : boolean {
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}

        const dx: number = Math.abs(first.x  - target.x);
        const dy: number = Math.abs(first.y - target.y);
        return dy <= 1 && dx <= 1;
    }

    public canAttack(board : Board, target : Cell) : boolean{
        if(!super.canAttack(board ,target)){return false;}
        const first : Cell | null = board.getFigurePosition(this);
        if (first === null){return false;}
        const dx: number = Math.abs(first.x  - target.x);
        const dy: number = Math.abs(first.y - target.y);
        return dy <= 1 && dx <= 1;
    }

}