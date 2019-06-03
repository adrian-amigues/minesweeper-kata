import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;
export type CellsWithCoordinates = Array<{ cell: Cell; x: number; y: number }>;

export class Grid {
    [key: number]: number;
    private _column: number;
    private _cells: Cells;

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell = minesCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];

            cells[rand] = cells[index];
            cells[index] = cell;
        }

        return new Grid(column, cells);
    }

    constructor(column: number, cells: Cells) {
        if (!Number.isInteger(column)) {
            throw new TypeError('column count must be an integer');
        }

        if (cells.length % column !== 0 || cells.length === 0) {
            throw new RangeError(
                'cell count must be dividable by column count'
            );
        }

        this._column = column;
        this._cells = cells;
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
    }

    map(
        callbackfn: (value: Cell, index: number, array: Cell[]) => {},
        thisArg?: any
    ) {
        return this._cells.map(callbackfn);
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    cellByCoodinates(x: number, y: number): Cell | undefined {
        const index = this.getCellIndexFromCoordinates(x, y);
        return index !== undefined ? this._cells[index] : undefined;
    }

    getCellIndexFromCoordinates(x: number, y: number): number | undefined {
        if (x < 0 || y < 0 || x >= this._column || y >= this._column)
            return undefined;
        return this._column * y + x;
    }

    getCellCoordinatesFromIndex(index: number) {
        return {
            x: index % this._column,
            y: Math.floor(index / this._column),
        };
    }

    getAdjacentCellsFromCoordinates(
        x: number,
        y: number
    ): CellsWithCoordinates {
        const adjacentCellCoordinates = [
            [x - 1, y - 1],
            [x, y - 1],
            [x + 1, y - 1],
            [x - 1, y],
            [x + 1, y],
            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1],
        ];
        return adjacentCellCoordinates
            .map(([x, y]) => ({ cell: this.cellByCoodinates(x, y), x, y }))
            .filter(({ cell }) => cell instanceof Cell) as CellsWithCoordinates;
    }

    getAdjacentCellsMineCount(index: number) {
        const { x, y } = this.getCellCoordinatesFromIndex(index);
        const adjacentCells = this.getAdjacentCellsFromCoordinates(x, y);

        return adjacentCells.reduce(
            (acc, { cell }) => acc + (cell.bomb ? 1 : 0),
            0
        );
    }

    hasUndugAdjacentCell(index: number): boolean {
        const { x, y } = this.getCellCoordinatesFromIndex(index);
        return this.getAdjacentCellsFromCoordinates(x, y).some(
            ({ cell }) => !cell.dug
        );
    }

    clearAllSafeCells() {
        let cellWithNoAdjacentMines;
        let grid: Grid = this;
        do {
            cellWithNoAdjacentMines = grid._cells.findIndex(
                (cell: Cell, index: number) =>
                    cell.dug &&
                    grid.getAdjacentCellsMineCount(index) === 0 &&
                    grid.hasUndugAdjacentCell(index)
            );
            if (cellWithNoAdjacentMines >= 0) {
                grid = grid.sendActionToSurroundingCells(
                    cellWithNoAdjacentMines,
                    'dig'
                );
            }
        } while (cellWithNoAdjacentMines >= 0);
        return grid;
    }

    sendActionToCell(cellIndex: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[cellIndex];

        cells[cellIndex] = cell[action]();
        return new Grid(this._column, cells);
    }

    sendActionToSurroundingCells(cellIndex: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const { x, y } = this.getCellCoordinatesFromIndex(cellIndex);
        const adjacentCells = this.getAdjacentCellsFromCoordinates(x, y);

        adjacentCells.forEach(({ cell, x, y }) => {
            const cellIndex = this.getCellIndexFromCoordinates(x, y);
            if (cellIndex !== undefined) {
                cells[cellIndex] = cell[action]();
            }
        });

        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }
}
