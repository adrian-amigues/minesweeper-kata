import React from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    status: CellStatus;
    onclick: Function;
};

const emojis = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥',
};

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
});

export const Cell: React.FunctionComponent<CellProps> = props => {
    return (
        <div
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
            {emojis[props.status]}
        </div>
    );
};
