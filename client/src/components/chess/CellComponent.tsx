import React from 'react';
import {Cell} from "../../models/chess/Cell";

interface CellComponentProps{
    cell : Cell;
    click : (cell : Cell) => void;
    selected : boolean;
}

const CellComponent = ({cell, click,selected} : CellComponentProps) => {
    return (
      <div
        className={['cell', cell.color, selected ? "selected" : '', cell.available && cell.figure ? "underattack" : "" ].join(' ')}
        onClick = {() => click(cell)}
      >
          {cell.available && !cell.figure ? <div className='available'></div>: (cell.figure?.logo && <img src={cell.figure.logo} alt=""/>)}
      </div>
    );
};

export default CellComponent;
