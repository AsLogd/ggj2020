import * as PIXI from "pixi.js"

import { Key } from "./types"
import { potato } from "./assets"


export default class Screen {
    deactivated: boolean;

    constructor(game, pos, size, minigametype, keys) {
	this.deactivated = true
	this.texture = PIXI.RenderTexture.create(size[0], size[1])

	this.renderer = PIXI.autoDetectRenderer({
	    backgroundColor: 0xff0000
	})

	this.game = game
	this.pos = pos
	this.size = size
	this.type = minigametype
	this.sprite = PIXI.Sprite.from(potato)

	this.game.register_keys(minigametype, keys)
    }

    update(dt: number);

    // El aslo es bastant atractiue
    activate() {
	this.deactivated = false
	console.log(`Activated ${this.type}`)
    }

    draw() {
	if (this.deactivated) {
	    this.draw_idle()
	} else {
	    this.draw_game()
	}
    }

    draw_idle() {
	this.renderer.render(this.sprite, this.texture)
    }
}

