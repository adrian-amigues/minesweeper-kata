import React from 'react';
import { CellAction } from './Domain/Cell';
import { Grid } from './Domain/Grid';

type GameContextProps = {
    grid: Grid;
    previousGrid: Grid | undefined;
    updateGridCellStatus: (index: number, status: CellAction) => void;
    undoLastMove: () => void;
};

type GridCustomHook = [
    Grid,
    Grid | undefined,
    (index: number, action: CellAction) => void,
    () => void
];

const initialContext: GameContextProps = {
    grid: Grid.generate(10, 10, 10),
    previousGrid: undefined,
    updateGridCellStatus: () => {},
    undoLastMove: () => {},
};

const useStateGridCells = (initialValue: Grid): GridCustomHook => {
    const [grid, setGrid] = React.useState(initialValue);
    const [previousGrid, setPreviousGrid] = React.useState<Grid | undefined>(
        undefined
    );

    return [
        grid,
        previousGrid,
        (index: number, action: CellAction) => {
            const newGrid = grid.sendActionToCell(index, action);
            const updatedCell = newGrid.cellByIndex(index);
            if (
                updatedCell &&
                updatedCell.dug &&
                !updatedCell.bomb &&
                newGrid.getAdjacentCellsMineCount(index) === 0
            ) {
                setGrid(newGrid.clearAllSafeCells());
            } else {
                setGrid(newGrid);
            }
            setPreviousGrid(grid);
        },
        () => {
            if (previousGrid !== undefined) {
                setGrid(previousGrid);
                setPreviousGrid(undefined);
            }
        },
    ];
};

export const GameContext = React.createContext<GameContextProps>(
    initialContext
);

export const GameContextProvider: React.FunctionComponent<
    React.ReactNode
> = props => {
    const [
        grid,
        previousGrid,
        updateGridCellStatus,
        undoLastMove,
    ] = useStateGridCells(initialContext.grid);

    return (
        <GameContext.Provider
            value={{ grid, previousGrid, updateGridCellStatus, undoLastMove }}
        >
            {props.children}
        </GameContext.Provider>
    );
};
