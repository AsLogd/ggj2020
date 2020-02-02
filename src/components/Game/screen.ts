import * as PIXI from "pixi.js"

import { Key } from "./types"
import { potato, screen_frag } from "./assets"
import {CRTFilter} from '@pixi/filter-crt';
import {GlitchFilter} from '@pixi/filter-glitch';


export default class Screen {
    deactivated: boolean;

    constructor(game, pos, size, minigametype, keys) {
	this.game = game

	this.deactivated = true
	this.texture = PIXI.RenderTexture.create(size[0], size[1])
	this.sprite = PIXI.Sprite.from(this.texture)
	this.sprite.position = { x: pos[0], y: pos[1] }
	this.game.stage.addChild(this.sprite)

	this.renderer = PIXI.autoDetectRenderer({
	    backgroundColor: 0xff0000
	})

	this.background = new PIXI.Graphics();

	this.background.beginFill(0x222222)
	this.background.drawRect(0, 0, size[0], size[1])
	this.background.endFill()

	this.pos = pos
	this.size = size
	this.type = minigametype

	this.crt_filter = new CRTFilter({curvature: 2, verticalLine: true})
	this.sprite.filters = [this.crt_filter]
	this.background.filters = [this.crt_filter]

	this.game.register_keys(minigametype, keys)

	this.text_style = new PIXI.TextStyle({
	    fontFamily: 'Commodore',
	    fontSize: 15,
	    fill: '#ffffff', // gradient
	    dropShadow: true,
	    dropShadowColor: '#000000',
	    dropShadowBlur: 4,
	    dropShadowAngle: Math.PI / 6,
	    dropShadowDistance: 6,
	    wordWrap: true,
	    wordWrapWidth: 440,
	});

	this.text = new PIXI.Text('Engine malfunction', this.text_style)
    }

    update(dt: number) {
    }

    activate(difficulty) {
	this.deactivated = false
	console.log(`Activated ${this.type}`)
	this.initialize(difficulty)
    }

    draw() {
	this.crt_filter.time += 0.5

	this.game.renderer.render(this.background, this.texture)

	if (this.deactivated) {
	    this.draw_idle()
	} else {
	    this.draw_game()
	    this.game.renderer.render(this.text, this.texture, false)
	}
    }

    draw_idle() {
	this.game.renderer.render(this.sprite, this.texture)
    }
}

