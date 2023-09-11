import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Rook} from "./figures/Rook";
import {Pawn} from "./figures/Pawn";
import {King} from "./figures/King";
import {Queen} from "./figures/Queen";
import {Bishop} from "./figures/Bishop";
import {Knight} from "./figures/Knight";
import { Figure, FigureNames } from "./figures/Figure";
import { GameStatus } from "./GameStatus";
import _ from "lodash"
import { fi } from "date-fns/locale";

function newFigureFromObject(obj : any, isFirstStep : boolean ) : any{
    switch (obj.name){
        case FigureNames.PAWN:
            const pawn = new Pawn(obj.color);
            pawn.isFirstStep = isFirstStep;
            return pawn
        case FigureNames.KING:
            const king = new King(obj.color);
            king.isFirstStep = isFirstStep;
            return king
        case FigureNames.KNIGHT:
            return new Knight(obj.color)
        case FigureNames.QUEEN:
            return new Queen(obj.color)
        case FigureNames.BISHOP:
            return new Bishop(obj.color)
        case FigureNames.ROOK:
            const rook = new Rook(obj.color);
            rook.isFirstStep = isFirstStep;
            return rook    
        default:
            console.log("eth is bad")
    }
}

export class Board {
    cells : Cell[][] = [];
    gameStatus : GameStatus = GameStatus.ACTIVE; 
    blackFigures : Figure[] = [];
    whiteFigures : Figure[] = [];
    blackKing : King = new King(Colors.BLACK);
    whiteKing : King = new King(Colors.WHITE);

    public initCells() : void{
        for (let i = 0; i < 8; i++) {
            const row : Cell[] = [];
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0) {
                    row.push(new Cell(Colors.BLACK, j, i));
                }else{
                    row.push(new Cell(Colors.WHITE,j,i));
                }
            }
            this.cells.push(row);
        }
    }

    static fromJSON(json: string): Board {
        const obj = JSON.parse(json);
        const newBoard = new Board();
        newBoard.gameStatus = obj.gameStatus
        for (let i = 0; i < obj.cells.length; i++) {
            const row : Cell[] = [];
            for (let j = 0; j < obj.cells[i].length; j++) {
                const cell = new Cell(obj.cells[i][j].color, obj.cells[i][j].x , obj.cells[i][j].y);
                if (obj.cells[i][j].figure){
                    const newFigure = newFigureFromObject(obj.cells[i][j].figure, obj.cells[i][j].figure.isFirstStep);
                    cell.figure = newFigure;
                    if (newFigure.color === Colors.WHITE){
                        newBoard.whiteFigures.push(newFigure);
                        if (newFigure.name === FigureNames.KING){
                            newBoard.whiteKing = newFigure;
                        }
                    }else{
                        newBoard.blackFigures.push(newFigure);
                        if (newFigure.name === FigureNames.KING){
                            newBoard.blackKing = newFigure;
                        }
                    }
                }
                row.push(cell);
            }
            newBoard.cells.push(row);
        }
        return newBoard
    }
    public getCopyBoard(): Board{
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.whiteFigures = this.whiteFigures;
        newBoard.whiteKing = this.whiteKing;
        newBoard.blackFigures = this.blackFigures;
        newBoard.blackKing = this.blackKing;
        return newBoard;
    }

    public getDeepCopyBoard() : Board{
       return  _.cloneDeep(this);
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x];
    }

    public getEnemyFigures(color : Colors) : Figure[]{
        return color === Colors.WHITE ? this.blackFigures : this.whiteFigures;
    }

    public getFriendlyFigures(color : Colors) : Figure[]{
        return color === Colors.WHITE ? this.whiteFigures : this.blackFigures;
    }

    public highlightCells(selectedCell : Cell | null){
        for (let index = 0; index < this.cells.length; index++) {
            const row = this.cells[index];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                cell.available = !!selectedCell?.figure?.canMoveOn(this, cell);
            }
        }
    }

    //TODO : delete figures from arrays
    public moveFigure(first : Cell,target : Cell ) : Cell{
        if (first.figure && first.figure.moveRule(this, target)){
            first.figure.moveFigure();
            target.setFigure(first.figure);
            first.figure = null;
            }
        return target;
    }

    public mustMove(first : Cell, target : Cell){
        if (first.figure){
            first.figure.moveFigure();
            target.setFigure(first.figure);
            first.figure = null;
            }
    }

    public getFigurePosition(f : Figure) : Cell | null {
        for (let  i= 0; i < this.cells.length; i++) {
            const row : Cell[] = this.cells[i];
            for (let j = 0; j < row.length; j++){
                const cell = row[j];
                if (cell.figure === f) {
                    return cell
                }
            }
        }
        return null
    }

    isEmptyByVertical(first : Cell, second : Cell): boolean{
        if (first.x !== second.x) {
            return false;
        }

        const min = Math.min(first.y, second.y);
        const max = Math.max(first.y, second.y);
        for (let y = min + 1; y < max; y++) {
            if(!this.getCell(first.x, y).isEmpty()) {
                return false
            }
        }
        return true;
    }

    isEmptyByHorizontal(first: Cell, second : Cell): boolean {
        if (first.y !== second.y) {
            return false;
        }

        const min = Math.min(first.x, second.x);
        const max = Math.max(first.x, second.x);
        for (let x = min + 1; x < max; x++) {
            if(!this.getCell(x, first.y).isEmpty()) {
                return false;
            }
        }
        return true;
    }

    public isEmptyByDiagonal(first : Cell, second : Cell) : boolean{
        const absX = Math.abs(second.x - first.x);
        const absY = Math.abs(second.y - first.y);
        if(absY !== absX)
            return false;

        const dy = first.y < second.y ? 1 : -1;
        const dx = first.x < second.x ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if(!this.getCell(first.x + dx*i, first.y + dy   * i).isEmpty())
                return false;
        }
        return true;
    }

    private getRow(from : Cell, to : Cell) : Cell[]{
        if (from.y !== to.y){
            return [];
        }
        const res : Cell[] = [ ];
        for (let index = from.x; index <= to.x; index++) {
            const element = this.cells[from.y][index];
            res.push(element);
        }
        return res;
    }

    public isCheckmate(color : Colors) : boolean{
        const king = color === Colors.WHITE ? this.whiteKing : this.blackKing;
        const figureCell = this.getFigurePosition(king);
        if (!figureCell){
            return false;
        }
        
        const friendlyFigures = this.getFriendlyFigures(color);
        for (let index = 0; index < friendlyFigures.length; index++) {
            const figure = friendlyFigures[index];
            if(this.cells.some(row => row.some(c => figure.canMoveOn(this,c))))
                return false;
        }
        return figureCell.isUnderAttack(this,king.color);
    }

    public isStalemate(color : Colors) : boolean{
        const king = color === Colors.WHITE ? this.whiteKing : this.blackKing;
        const figureCell = this.getFigurePosition(king);
        if (!figureCell){
            return false;
        }
        
        
        const friendlyFigures = this.getFriendlyFigures(color);
        for (let index = 0; index < friendlyFigures.length; index++) {
            const figure = friendlyFigures[index];
            if(this.cells.some(row => row.some(c => figure.canMoveOn(this,c))))
                return false;
        }
        return !figureCell.isUnderAttack(this,king.color);
    }

    public canCastling(firstCell : Cell, secondCell : Cell, color : Colors): boolean{
        const row : Cell[] = this.getRow(firstCell,secondCell);
        if ((!firstCell.figure?.isFirstStep || !secondCell.figure?.isFirstStep) )
                return false;
            if (!this.isEmptyByHorizontal(firstCell,secondCell)){
                return false;
            }
            if (row.some((e : Cell) => e.isUnderAttack(this,color))){
                console.log("cant castling, row is under attack");
                return false;
            }
            return true;
    }

    public shortCastling(color : Colors){
        //for white
        if (color === Colors.WHITE) {
            const kingCell : Cell = this.getCell(4,7);
            const rookCell : Cell = this.getCell(7,7);
            if (!this.canCastling(kingCell,rookCell, Colors.WHITE))
                return;
            this.mustMove(kingCell,this.getCell(6,7));
            this.mustMove(rookCell,this.getCell(5,7));
            return
        }
        //for black
        const kingCell : Cell = this.getCell(4,0);
        const rookCell : Cell = this.getCell(7,0);
        if (!this.canCastling(kingCell,rookCell, Colors.BLACK))
            return;
        this.mustMove(kingCell,this.getCell(6,0));
        this.mustMove(rookCell,this.getCell(5,0));
        return ;
    }

    public longCastling(color : Colors){
        //for white
        if (color === Colors.WHITE) {
            const kingCell : Cell = this.getCell(4,7);
            const rookCell : Cell = this.getCell(0,7);
            if (!this.canCastling(rookCell,kingCell, Colors.WHITE))
                return;
            this.mustMove(kingCell,this.getCell(2,7));
            this.mustMove(rookCell,this.getCell(3,7));
            return
        }
        //for black
        const kingCell : Cell = this.getCell(4,0);
        const rookCell : Cell = this.getCell(0,0);
        if (!this.canCastling(kingCell,rookCell, Colors.BLACK))
            return;
        this.mustMove(kingCell,this.getCell(2,0));
        this.mustMove(rookCell,this.getCell(3,0));
        return ;
    }

    public isBoardEnd(target : Cell, figureColor : Colors) : boolean{
        if (figureColor === Colors.BLACK){
            return target.y === 7; 
        }
        return target.y === 0;
    }

    public promotion(target : Cell, figureColor : Colors){
        this.getFriendlyFigures(figureColor).push(target.setFigure(new Queen(figureColor)));
    }
    
    private addPawns() {
        for (let i = 0; i < 8; i++) {
           this.blackFigures.push(this.getCell(i, 1).setFigure( new Pawn(Colors.BLACK)));
           this.whiteFigures.push(this.getCell(i, 6).setFigure( new Pawn(Colors.WHITE)));
        }
    }

    private addKings() {
       this.blackFigures.push(this.getCell(4, 0).setFigure( this.blackKing));
       this.whiteFigures.push(this.getCell(4, 7).setFigure( this.whiteKing));
    }

    private addQueens() {
        this.blackFigures.push(this.getCell(3, 0).setFigure(new Queen(Colors.BLACK)));
        this.whiteFigures.push(this.getCell(3, 7).setFigure(new Queen(Colors.WHITE)));
    }

    private addBishops() {
        this.blackFigures.push(this.getCell(2, 0).setFigure(new Bishop(Colors.BLACK)));
        this.blackFigures.push(this.getCell(5, 0).setFigure(new Bishop(Colors.BLACK)));
        this.whiteFigures.push(this.getCell(2, 7).setFigure(new Bishop(Colors.WHITE)));
        this.whiteFigures.push(this.getCell(5, 7).setFigure(new Bishop(Colors.WHITE)));
    }

    private addKnights() {
        this.blackFigures.push(this.getCell(1, 0).setFigure(new Knight(Colors.BLACK)));
        this.blackFigures.push(this.getCell(6, 0).setFigure(new Knight(Colors.BLACK)));
        this.whiteFigures.push(this.getCell(1, 7).setFigure(new Knight(Colors.WHITE)));
        this.whiteFigures.push(this.getCell(6, 7).setFigure(new Knight(Colors.WHITE)));
    }

    private addRooks() {
        this.blackFigures.push(this.getCell(0, 0).setFigure(new Rook(Colors.BLACK)));
        this.blackFigures.push(this.getCell(7, 0).setFigure(new Rook(Colors.BLACK)));
        this.whiteFigures.push(this.getCell(0, 7).setFigure(new Rook(Colors.WHITE)));
        this.whiteFigures.push(this.getCell(7, 7).setFigure(new Rook(Colors.WHITE)));
    }

    public addFigures() {
        this.addPawns()
        this.addKnights()
        this.addKings()
        this.addBishops()
        this.addQueens()
        this.addRooks()
    }

}