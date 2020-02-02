import * as PIXI from "pixi.js"
import Screen from "./screen"
import { Key, MinigameType } from "./types"

import { map } from "./assets"


function opposite(key) {
    if (key === Key.Up) {
	return Key.Down
    }
    if (key === Key.Down) {
	return Key.Up
    }
    if (key === Key.Left) {
	return Key.Right
    }
    if (key === Key.Right) {
	return Key.Left
    }
}


export default class VertexPuzzle extends Screen {
    constructor(game, pos, size) {
        this.keys = []
        super(game, pos, size, MinigameType.VERTEX_COUNT, this.keys)
    }

    initialize(difficulty: number) {}

    update(dt: number) {}

    draw_game() {}

    event(key: Key) {}
}


export class VertexReal extends Screen {
    constructor(game, pos, size) {
	this.keys = []
	super(game, pos, size, MinigameType.VERTEX_COUNT_REAL, this.keys)

	this.enemy_g = new PIXI.Graphics()
	this.enemy_g.beginFill(0xffb72a)
	this.enemy_g.drawRect(0, 0, 10, 10)
	this.enemy_g.endFill()

	this.radar_circle = new PIXI.Graphics()
	this.radar_circle.lineStyle(2, 0xaa8711, 1)
	this.radar_circle.arc(size[0]/2, size[1]/2, 120, 0, 2*Math.PI)
	this.radar_circle.arc(size[0]/2, size[1]/2, 80, 0, 2*Math.PI)
	this.radar_circle.arc(size[0]/2, size[1]/2, 40, 0, 2*Math.PI)
	this.radar_circle.lineTo(size[0]/2, size[1]/2)

	this.radar_circle.pivot = {x: size[0]/2, y: size[1]/2}
	this.radar_circle.position = {x: size[0]/2, y: size[1]/2}

	this.enemies = []
    }

    initialize(difficulty: number) {}

    update(dt: number) {
	this.deactivated = false

	if (Math.random() < 0.005) {
	    this.enemies.push({x: Math.random() * this.size[0],
			       y: Math.random() * this.size[1],
			       d: (Math.random() - 0.5) * 2 * Math.PI })
	}
	
	for (let i = 0; i < this.enemies.length; ++i) {
	    const enemy = this.enemies[i];

	    enemy.d += (Math.random() - 0.5) * 0.1
	    enemy.x += dt * 15 * Math.cos(enemy.d)
	    enemy.y += dt * 15 * Math.sin(enemy.d)
	}

	this.radar_circle.rotation += 0.05
    }

    draw_game() {
	this.game.renderer.render(this.radar_circle, this.texture, false)

	for (let i = 0; i < this.enemies.length; ++i) {
	    this.game.renderer.render(this.enemy_g, this.texture, false)
	}
    }

    event(key: Key) {}
}
