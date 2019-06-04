import React from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    status: CellStatus;
    onclick: Function;
    surroundingMines: number;
};

const cellDisplay = (surroundingMines: number) => ({
    untouched: '',
    dug: surroundingMines === 0 ? '' : surroundingMines,
    flagged: '🚩',
    detonated: '💥',
});

const cellStyle = (status: CellStatus): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    boxShadow: 'inset 0px 0px 1px 2px #00000052',
    backgroundColor:
        status === 'untouched' || status === 'flagged' ? '#4c97f3' : '#f5f5f5',
    fontFamily: 'sans-serif',
    fontSize: '1.4rem',
});

export const Cell: React.FunctionComponent<CellProps> = props => {
    return (
        <div
            data-status={props.status}
            className="cell"
            onClick={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            onContextMenu={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            style={cellStyle(props.status)}
        >
            {cellDisplay(props.surroundingMines)[props.status]}
        </div>
    );
};
