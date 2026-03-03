import { createPlatform } from './platform.js';
import { Item } from './item.js';
import { Enemy } from './enemy.js';
import { PowerUp } from './powerup.js';

export class Level {
    constructor(data) {
        this.name = data.name;
        this.width = data.width;
        this.height = data.height;
        this.playerStart = data.playerStart;

        this.platforms = data.platforms.map(p => createPlatform(p));

        this.items = (data.items || []).map(
            i => new Item(i.x, i.y, i.type)
        );

        this.enemies = (data.enemies || []).map(
            e => new Enemy(e.x, e.y, e.patrolDistance, e.type)
        );

        this.powerups = (data.powerups || []).map(
            p => new PowerUp(p.x, p.y, p.type)
        );
    }

    update(dt) {
        for (const platform of this.platforms) {
            platform.update(dt);
        }
        for (const item of this.items) {
            item.update(dt);
        }
        for (const enemy of this.enemies) {
            enemy.update(dt);
        }
        for (const powerup of this.powerups) {
            powerup.update(dt);
        }
    }

    render(ctx) {
        for (const platform of this.platforms) {
            platform.render(ctx);
        }
    }

    static async load(path) {
        const response = await fetch(path);
        const data = await response.json();
        return new Level(data);
    }
}
