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
	this.keys = [Key.N1, Key.N2, Key.N3, Key.N4, Key.N5, Key.N6, Key.N7, Key.N8, Key.N9, Key.N0]
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

	this.time_to_timeout = 5
	this.timeout = 0

	this.enemies = []
    }

    initialize(difficulty: number) {
	this.timeout = 0
    }

    update(dt: number) {
	if (this.deactivated) {
	    if (Math.random() < 0.3) {
		if (this.enemies.length < 9) {
		    this.enemies.push({x: Math.random() * this.size[0],
				    y: Math.random() * this.size[1],
				    d: (Math.random() - 0.5) * 2 * Math.PI
				    dead: false})
		}
		else {
		    for (let i = 0; i < this.enemies.length; ++i) {
			if (this.enemies[i].dead) {
			    this.enemies[i].x = Math.random() * this.size[0]
			    this.enemies[i].y = Math.random() * this.size[1]
			    this.enemies[i].d = (Math.random() - 0.5) * 2 * Math.PI
			    this.enemies[i].dead = false
			    break
			}
		    }
		}
	    }

	    if (Math.random() < 0.25) {
		const choose = Math.floor(Math.random() * this.enemies.length)
		if (this.enemies[choose]) {
		    this.enemies[choose].dead = true
		}
	    }

	    for (let i = 0; i < this.enemies.length; ++i) {
		const enemy = this.enemies[i];

		enemy.d += (Math.random() - 0.5) * 0.1
		enemy.x += dt * 30 * Math.cos(enemy.d)
		enemy.y += dt * 30 * Math.sin(enemy.d)

		if (enemy.x < 0 || enemy.x > this.size[0] || enemy.y < 0 || enemy.y > this.size[1]) {
		    enemy.dead = true
		}
	    }
	}
	else {
	    this.timeout += dt

	    if (this.timeout >= this.time_to_timeout) {
		this.game.loseLife()
		this.deactivated = true
	    }
	}

	this.radar_circle.rotation += 0.15
    }

    draw_game() {
	this.game.renderer.render(this.radar_circle, this.texture, false)
	
	for (let i = 0; i < this.enemies.length; ++i) {
	    if (this.enemies[i].dead) {
		continue
	    }

	    this.enemy_g.tint = 0xff0000
	    this.enemy_g.position.x = Math.floor(this.enemies[i].x/10)*10
	    this.enemy_g.position.y = Math.floor(this.enemies[i].y/10)*10
	    this.game.renderer.render(this.enemy_g, this.texture, false)
	}

	this.enemy_g.tint = 0xffffff
    }

    draw_idle() {
	this.game.renderer.render(this.radar_circle, this.texture, false)

	for (let i = 0; i < this.enemies.length; ++i) {
	    if (this.enemies[i].dead) {
		continue
	    }

	    this.enemy_g.position.x = Math.floor(this.enemies[i].x/10)*10
	    this.enemy_g.position.y = Math.floor(this.enemies[i].y/10)*10
	    this.game.renderer.render(this.enemy_g, this.texture, false)
	}
    }

    event(key: Key) {
	const num = parseInt(key)

	let cenemies = 0
	for (let i = 0; i < this.enemies.length; ++i) {
	    if (!this.enemies[i].dead) {
		cenemies += 1
	    }
	}

	if (!this.deactivated) {
	    if (num === cenemies) {
	    	this.game.score += 700
		this.deactivated = true
	    }
	    else {
		this.game.loseLife()
		this.deactivated = true
	    }
	}
    }
}
