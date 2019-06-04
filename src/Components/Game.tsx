import React from 'react';

type GameOver = false | 'victory' | 'defeat';
type GameProps = {
    gameOver: GameOver;
};

const gameTextStyle = (gameOver: GameOver): React.CSSProperties => ({
    height: '120px',
    fontSize: '4.5rem',
    fontFamily: 'cursive',
    textAlign: 'center',
    color: gameOver === 'victory' ? 'rgb(101, 204, 41)' : 'rgb(189, 22, 58)',
});

export const Game: React.FunctionComponent<GameProps> = props => {
    return <div style={gameTextStyle(props.gameOver)}>{props.gameOver}</div>;
};
