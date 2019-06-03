import { Grid } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';

describe(Grid, () => {
    test('it needs to be filled', () => {
        expect(() => new Grid(2, [])).toThrowError(RangeError);
    });

    describe('cellByCoodinates', () => {
        test('it returns the first cell in grid when asking for x:0 y:0', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(5, [
                expected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
            ]);

            expect(grid.cellByCoodinates(0, 0)).toBe(expected);
        });

        test('it returns the last cell in grid when asking for x:3 y:1', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(4, [
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                expected,
            ]);

            const cell = grid.cellByCoodinates(3, 1);
            expect(cell).toBe(expected);
        });

        test('it returns undefined when asked for x:-1, y:1', () => {
            const cell = Cell.withBomb();
            const grid = new Grid(3, [cell, cell, cell]);

            const result = grid.cellByCoodinates(-1, 1);
            expect(result).toBe(undefined);
        });

        test('it returns undefined when asked a coordinate value higher or equal to the column count', () => {
            const cell = Cell.withoutBomb();
            const grid = new Grid(3, [cell, cell, cell]);

            const result = grid.cellByCoodinates(3, 1);
            expect(result).toBe(undefined);
        });
    });

    describe('getCellIndexFromCoordinates', () => {
        test('it returns 0 when asked for the x=0 y=0', () => {
            const cell = Cell.withoutBomb();
            const grid = new Grid(2, [cell, cell]);

            const result = grid.getCellIndexFromCoordinates(0, 0);
            expect(result).toBe(0);
        });

        test('it returns 4 when asked for the x=1 y=1 in a grid with 3 columns', () => {
            const cell = Cell.withoutBomb();
            const grid = new Grid(3, [cell, cell, cell]);

            const result = grid.getCellIndexFromCoordinates(1, 1);
            expect(result).toBe(4);
        });

        test('it returns undefined when asked for x:-1, y:1', () => {
            const cell = Cell.withoutBomb();
            const grid = new Grid(2, [cell, cell]);

            const result = grid.getCellIndexFromCoordinates(-1, 1);
            expect(result).toBe(undefined);
        });

        test('it returns undefined when asked a coordinate value higher or equal to the column count', () => {
            const cell = Cell.withoutBomb();
            const grid = new Grid(2, [cell, cell]);

            const result = grid.getCellIndexFromCoordinates(4, 6);
            expect(result).toBe(undefined);
        });
    });

    describe('getCellCoordinatesFromIndex', () => {
        test('it returns x=0 y=0 when asked for the cell at index 0', () => {
            const cell = Cell.withoutBomb();
            const grid = new Grid(3, [cell, cell, cell]);

            expect(grid.getCellCoordinatesFromIndex(0)).toEqual({ x: 0, y: 0 });
        });

        test('it returns x=2 y=1 when asked for the cell at index 5', () => {
            const cell = Cell.withoutBomb();
            const grid = new Grid(3, [cell, cell, cell]);

            expect(grid.getCellCoordinatesFromIndex(5)).toEqual({ x: 2, y: 1 });
        });
    });

    describe('getAdjacentCellsFromCoordinates', () => {
        test('it returns CellsWithCoordinates array of all 8 surrounding cells when in the middle', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(3, [
                expected,
                expected,
                expected,
                expected,
                unexpected,
                expected,
                expected,
                expected,
                expected,
            ]);

            const adjacentCells = grid.getAdjacentCellsFromCoordinates(1, 1);
            expect(adjacentCells.length).toBe(8);
            expect(adjacentCells).toEqual([
                { cell: expected, x: 0, y: 0 },
                { cell: expected, x: 1, y: 0 },
                { cell: expected, x: 2, y: 0 },
                { cell: expected, x: 0, y: 1 },
                { cell: expected, x: 2, y: 1 },
                { cell: expected, x: 0, y: 2 },
                { cell: expected, x: 1, y: 2 },
                { cell: expected, x: 2, y: 2 },
            ]);
        });

        test('it returns an array of only 3 cells when in a corner', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(3, [
                unexpected,
                expected,
                unexpected,
                expected,
                expected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
            ]);

            const adjacentCells = grid.getAdjacentCellsFromCoordinates(0, 0);
            expect(adjacentCells.length).toBe(3);
            expect(adjacentCells).toEqual([
                { cell: expected, x: 1, y: 0 },
                { cell: expected, x: 0, y: 1 },
                { cell: expected, x: 1, y: 1 },
            ]);
        });
    });

    describe('getAdjacentCellsMineCount', () => {
        test('it returns 0 when there are no bombs around it', () => {
            const withBomb = Cell.withBomb();
            const withoutBomb = Cell.withoutBomb();
            const grid = new Grid(2, [
                withBomb,
                withoutBomb,
                withoutBomb,
                withoutBomb,
            ]);

            const adjacentMineCount = grid.getAdjacentCellsMineCount(0);
            expect(adjacentMineCount).toBe(0);
        });

        test('it returns 8 when there are only bombs around it', () => {
            const withBomb = Cell.withBomb();
            const withoutBomb = Cell.withoutBomb();
            const grid = new Grid(3, [
                withBomb,
                withBomb,
                withBomb,
                withBomb,
                withoutBomb,
                withBomb,
                withBomb,
                withBomb,
                withBomb,
            ]);

            const adjacentMineCount = grid.getAdjacentCellsMineCount(4);
            expect(adjacentMineCount).toBe(8);
        });
    });

    describe('hasUndugAdjacentCell', () => {
        test('it returns true if the cell is adjacent to one undug cell', () => {
            const cell = Cell.withoutBomb();
            const grid = new Grid(2, [
                cell.dig(),
                cell.dig(),
                cell.dig(),
                cell,
            ]);

            const result = grid.hasUndugAdjacentCell(0);
            expect(result).toBe(true);
        });

        test('it returns false if the cell has no adjacent undug cells', () => {
            const cell = Cell.withoutBomb();
            const grid = new Grid(2, [
                cell.dig(),
                cell.dig(),
                cell.dig(),
                cell.dig(),
            ]);

            const result = grid.hasUndugAdjacentCell(0);
            expect(result).toBe(false);
        });
    });

    describe('clearAllSafeCells', () => {
        test('it returns the same grid if there is no dug cell adjacent ton only undug mine-free cells', () => {
            const withBomb = Cell.withBomb();
            const withoutBomb = Cell.withoutBomb();
            const grid = new Grid(2, [
                withoutBomb.dig(),
                withBomb,
                withBomb,
                withBomb,
            ]);

            const result = grid.clearAllSafeCells();
            expect(result).toBe(grid);
        });

        test('it returns an updated grid if there is a dug cell adjacent to only undug mine-free cells', () => {
            const withBomb = Cell.withBomb();
            const withoutBomb = Cell.withoutBomb();
            const grid = new Grid(3, [
                withoutBomb.dig(),
                withoutBomb,
                withBomb,
                withoutBomb,
                withoutBomb,
                withBomb,
                withBomb,
                withBomb,
                withBomb,
            ]);
            /* _ c b
               c c b
               b b b */

            const result = grid.clearAllSafeCells();
            // @ts-ignore
            expect(result._cells).toEqual([
                withoutBomb.dig(),
                withoutBomb.dig(),
                withBomb,
                withoutBomb.dig(),
                withoutBomb.dig(),
                withBomb,
                withBomb,
                withBomb,
                withBomb,
            ]);
            /* _ _ b
               _ _ b
               b b b */
        });

        test('it returns an updated grid if there is a dug cell adjacent to only undug mine-free cells (with recursivity)', () => {
            const withBomb = Cell.withBomb();
            const withoutBomb = Cell.withoutBomb();
            const grid = new Grid(3, [
                withoutBomb.dig(),
                withoutBomb,
                withoutBomb,
                withoutBomb,
                withoutBomb,
                withoutBomb,
                withBomb,
                withBomb,
                withBomb,
            ]);
            /* _ c c
               c c c
               b b b */

            const result = grid.clearAllSafeCells();
            // @ts-ignore
            expect(result._cells).toEqual([
                withoutBomb.dig(),
                withoutBomb.dig(),
                withoutBomb.dig(),
                withoutBomb.dig(),
                withoutBomb.dig(),
                withoutBomb.dig(),
                withBomb,
                withBomb,
                withBomb,
            ]);
            /* _ _ _
               _ _ _
               b b b */
        });
    });

    describe('generator', () => {
        const row = 10;
        const column = row;
        const iterator = Array.from(Array(row * column));

        test('it create a grid with cells', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                expect(grid.cellByIndex(index)).toBeDefined();
            });
        });

        test('it create a grid without any mines', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const dugCell = cell.dig();
                    expect(dugCell.detonated).toBe(false);
                }
            });
        });

        test('it create a grid full of mines', () => {
            const grid = Grid.generate(row, column, row * column);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const trappedDugCell = cell.dig();
                    expect(trappedDugCell.detonated).toBe(true);
                }
            });
        });

        test('it create a grid with 10 mines out of 100 cells', () => {
            const grid = Grid.generate(row, column, 10);
            const mineCount = iterator.reduce((count, _, index) => {
                const cell = grid.cellByIndex(index);
                if (cell === undefined) return count;

                const dugCell = cell.dig();
                return dugCell.detonated === true ? count + 1 : count;
            }, 0);

            expect(mineCount).toBe(10);
        });
    });
});
