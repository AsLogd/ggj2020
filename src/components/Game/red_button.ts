import * as PIXI from "pixi.js"


import * as Util from "misc/Util"
import {Effect} from "./audio"
import Screen from "./screen"
import { Key, MinigameType } from "./types"

import { map } from "./assets"

export default class RedButton extends Screen {
	keys: Key[]

	readonly base_timeout: number = 3000

	input_timeout: number

	really_activated: boolean = false

	constructor(game, pos, size) {
		super(game, pos, size, MinigameType.RED_BUTTON, [Key.Enter])
		this.keys = [Key.Enter]
		this.background.fill.alpha=0
	}

	initialize(difficulty: number) {
		this.really_activated = true
		this.input_timeout = this.base_timeout/(difficulty+1)
		this.game.audio.playEffect(Effect.COMPLEX_BEEP_LOSE)
	}

	update(dt: number) {
		this.deactivated = false
		this.input_timeout -= dt*1000
		if(this.input_timeout < 0){
			this.really_activated= false
		}
	}

	draw_game() {
		if(!this.really_activated)
			return
		const w = this.size[0]
		const h = this.size[1]
		// Create the main stage for your display objects
		const stage = new PIXI.Container()
		const btn = new PIXI.Graphics();

		btn.beginFill(0xFF0000)
		btn.drawCircle(w/2, h/2, w)
		btn.endFill()
		btn.alpha = (this.input_timeout/100) % 1
		stage.addChild(btn)

		this.game.renderer.render(stage, this.texture, false)
	}

	event(key: Key) {
		if (!this.really_activated) 
			return
		
		if(key === Key.Enter){
			console.log("+1 life")
			this.game.winLife()
			this.game.audio.playEffect(Effect.BEEP_RESTORE)
			this.really_activated = false
		}
	}
}
