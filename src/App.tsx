import React from 'react';
import { render } from 'react-dom/index';
import { GameContextProvider } from './GameContext';
import { Grid } from './Components/Grid';

const App = () => {
    return (
        <div style={{ position: 'relative', height: '100%' }}>
            <GameContextProvider>
                <Grid />
            </GameContextProvider>
        </div>
    );
};

const node = document.getElementById('root');
render(React.createElement(App), node);
