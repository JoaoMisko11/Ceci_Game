import { describe, it, expect } from 'vitest';
import { SpatialGrid } from '../js/spatial-grid.js';

describe('SpatialGrid', () => {
    it('inicializa com cellSize padrao', () => {
        const grid = new SpatialGrid();
        expect(grid.cellSize).toBe(128);
    });

    it('insere e encontra entidade na mesma celula', () => {
        const grid = new SpatialGrid(100);
        const entity = { x: 50, y: 50, w: 20, h: 20 };
        grid.insert(entity);

        const result = grid.query(40, 40, 30, 30);
        expect(result).toContain(entity);
    });

    it('nao retorna entidade distante', () => {
        const grid = new SpatialGrid(100);
        const entity = { x: 500, y: 500, w: 20, h: 20 };
        grid.insert(entity);

        const result = grid.query(0, 0, 30, 30);
        expect(result).not.toContain(entity);
    });

    it('retorna entidade que cruza multiplas celulas', () => {
        const grid = new SpatialGrid(100);
        const bigEntity = { x: 80, y: 80, w: 40, h: 40 }; // cruza 4 celulas
        grid.insert(bigEntity);

        // Consultar na celula (1,1) que contem parte da entidade
        const result = grid.query(110, 110, 10, 10);
        expect(result).toContain(bigEntity);
    });

    it('nao retorna duplicatas para entidade em multiplas celulas', () => {
        const grid = new SpatialGrid(100);
        const bigEntity = { x: 80, y: 80, w: 40, h: 40 };
        grid.insert(bigEntity);

        // Consultar area que cobre todas as celulas da entidade
        const result = grid.query(70, 70, 60, 60);
        const count = result.filter(e => e === bigEntity).length;
        expect(count).toBe(1);
    });

    it('insertAll insere multiplas entidades', () => {
        const grid = new SpatialGrid(100);
        const entities = [
            { x: 10, y: 10, w: 20, h: 20 },
            { x: 50, y: 50, w: 20, h: 20 },
            { x: 200, y: 200, w: 20, h: 20 }
        ];
        grid.insertAll(entities);

        const result = grid.query(0, 0, 80, 80);
        expect(result).toContain(entities[0]);
        expect(result).toContain(entities[1]);
        expect(result).not.toContain(entities[2]);
    });

    it('clear remove todas as entidades', () => {
        const grid = new SpatialGrid(100);
        grid.insert({ x: 50, y: 50, w: 20, h: 20 });
        grid.clear();

        const result = grid.query(0, 0, 200, 200);
        expect(result.length).toBe(0);
    });

    it('aceita entidades com width/height ao inves de w/h', () => {
        const grid = new SpatialGrid(100);
        const entity = { x: 50, y: 50, width: 20, height: 20 };
        grid.insert(entity);

        const result = grid.query(40, 40, 30, 30);
        expect(result).toContain(entity);
    });
});
