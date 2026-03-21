// Grade espacial para otimizar deteccao de colisao
// Divide o mundo em celulas e agrupa entidades, evitando checar pares distantes

export class SpatialGrid {
    constructor(cellSize = 128) {
        this.cellSize = cellSize;
        this.cells = new Map();
    }

    // Chave unica para uma celula
    _key(cx, cy) {
        return cx * 73856093 ^ cy * 19349663; // hash simples
    }

    clear() {
        this.cells.clear();
    }

    // Insere uma entidade na grade (usa x, y, w, h)
    insert(entity) {
        const x = entity.x ?? 0;
        const y = entity.y ?? 0;
        const w = entity.w ?? entity.width ?? 0;
        const h = entity.h ?? entity.height ?? 0;

        const minCX = Math.floor(x / this.cellSize);
        const minCY = Math.floor(y / this.cellSize);
        const maxCX = Math.floor((x + w) / this.cellSize);
        const maxCY = Math.floor((y + h) / this.cellSize);

        for (let cx = minCX; cx <= maxCX; cx++) {
            for (let cy = minCY; cy <= maxCY; cy++) {
                const key = this._key(cx, cy);
                let list = this.cells.get(key);
                if (!list) {
                    list = [];
                    this.cells.set(key, list);
                }
                list.push(entity);
            }
        }
    }

    // Insere todas as entidades de um array
    insertAll(entities) {
        for (let i = 0; i < entities.length; i++) {
            this.insert(entities[i]);
        }
    }

    // Retorna candidatos que podem colidir com o retangulo dado
    query(x, y, w, h) {
        const minCX = Math.floor(x / this.cellSize);
        const minCY = Math.floor(y / this.cellSize);
        const maxCX = Math.floor((x + w) / this.cellSize);
        const maxCY = Math.floor((y + h) / this.cellSize);

        const seen = new Set();
        const result = [];

        for (let cx = minCX; cx <= maxCX; cx++) {
            for (let cy = minCY; cy <= maxCY; cy++) {
                const key = this._key(cx, cy);
                const list = this.cells.get(key);
                if (!list) continue;
                for (let i = 0; i < list.length; i++) {
                    const e = list[i];
                    if (!seen.has(e)) {
                        seen.add(e);
                        result.push(e);
                    }
                }
            }
        }

        return result;
    }
}
