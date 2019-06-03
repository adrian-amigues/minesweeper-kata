import React from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';
import { isDefeated, isVictorious } from '../Domain/Rules';

const playAreaStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const undoStyle: React.CSSProperties = {
    position: 'relative',
    left: '50%',
    transform: 'translate(-50%, 0)',
    fontSize: '1.3rem',
    background: '#ea4dd4',
    borderRadius: '8px',
    marginTop: '10px',
};

export const Grid: React.FunctionComponent = () => {
    const {
        grid,
        previousGrid,
        updateGridCellStatus,
        undoLastMove,
    } = React.useContext(GameContext);

    const handleClick = (index: number, button: number) => {
        updateGridCellStatus(index, button === 0 ? 'dig' : 'flag');
    };

    const gameOver =
        (isDefeated(grid) && 'defeat') ||
        (isVictorious(grid) && 'victory') ||
        false;

    return (
        <div style={playAreaStyle}>
            <Game gameOver={gameOver} />
            <div
                style={{
                    display: 'flex',
                    boxSizing: 'content-box',
                    flexWrap: 'wrap',
                    width: `calc(40px * ${grid.column})`,
                    margin: 'auto',
                }}
            >
                {grid.map((cell, index) => (
                    <Cell
                        key={index}
                        status={cell.status}
                        surroundingMines={grid.getAdjacentCellsMineCount(index)}
                        onclick={(ev: MouseEvent) =>
                            handleClick(index, ev.button)
                        }
                    />
                ))}
            </div>
            <button
                style={undoStyle}
                disabled={previousGrid === undefined}
                onClick={() => undoLastMove()}
            >
                Undo last action
            </button>
        </div>
    );
};
