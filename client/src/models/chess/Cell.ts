import { type } from "os";
import { Board } from "./Board";
import {Colors} from "./Colors";
import {Figure} from "./figures/Figure";
import { King } from "./figures/King";
export class Cell{
    color : Colors;
    readonly x : number;
    readonly y : number;
    figure : Figure | null;
    id : number;
    available : boolean;

    constructor(color : Colors, x : number, y : number) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.figure = null;
        this.available = false;
        this.id = Math.random()
    }

    static fromJSON(json : string) : Cell{
        const cellObj = JSON.parse(json)
        return new Cell(cellObj.color,cellObj.x,cellObj.y)
    }

    isEmpty() : boolean{
        return !this.figure;
    }

    public isUnderAttack(board : Board, friendlyColor : Colors) : boolean{
        const enemyFigures : Figure[] = board.getEnemyFigures(friendlyColor);
        for (const enemyFigure of enemyFigures){
            if (enemyFigure.canAttack(board, this))
                return true;
        }
        return false;
    }

    isEnemy(f : Figure){
        return !this.isEmpty() && f.color !== this.figure?.color
    }

    setFigure(figure : Figure)  :  Figure{
        this.figure = figure;
        return figure
    }

}