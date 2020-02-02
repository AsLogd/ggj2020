import * as PIXI from "pixi.js"


import * as Util from "misc/Util"
import {Effect} from "./audio"
import Screen from "./screen"
import { Key, MinigameType } from "./types"

import { map } from "./assets"

enum SimonState {
	PRE,
	LISTEN,
	INPUT,
	POST
}


export default class SimonSays extends Screen {
	keys: Key[]
	state: SimonState

	readonly pre_waiting_ms: number = 3000
	readonly post_waiting_ms: number = 3000

	pre_waiting_ms_current: number
	post_waiting_ms_current: number

	speed: number
	sequence: Key[] = []
	sequence_listen: Key[]
	sequence_input: Key[]

	listen_activation_intereval_base: number
	listen_activation_intereval_current: number

	input_timeout: number

	win: boolean = false



	key_activation = {
		[Key.A]: 30,
		[Key.S]: 30,
		[Key.D]: 30,
		[Key.W]: 30
	}

	key_max_activation = 100
	key_min_activation = 30

	constructor(game, pos, size) {
		const keys = [Key.A, Key.S, Key.D, Key.W] 
		super(game, pos, size, MinigameType.SIMON_SAYS, keys)
		this.keys = keys
		this.state = SimonState.PRE
	}

	getRandomKey() {
		const i = Math.floor(Math.random()*4)
		return this.keys[i]
	}

	getRandomTitle(){
		const i = Math.floor(Math.random()*5)
		return [
			"Ñ??ÇÇÇÇÇ <ºº!",
			"&%¡¡%%0x0000FFFFFFFF",
			"NaN 581037510",
			"<[[[[[[[[[[[",
			"fatal: @0x000000",
		][i]
	}

	initialize(difficulty: number) {
		this.state = SimonState.PRE
		this.text.text = this.getRandomTitle()
		this.text.style = {fill: "pink"}
		this.key_activation = {
			[Key.A]: 30,
			[Key.S]: 30,
			[Key.D]: 30,
			[Key.W]: 30
		}

		this.win = false
		this.pre_waiting_ms_current = this.pre_waiting_ms
		this.post_waiting_ms_current = this.post_waiting_ms
		this.speed = difficulty+1
		const sequenceLength = (difficulty+1)
		this.sequence=[]
		for(let i = 0; i < sequenceLength; i++) {
			this.sequence.push( this.getRandomKey() )
		}
		this.sequence_listen = [...this.sequence]
		this.sequence_input = [...this.sequence]
		this.listen_activation_intereval_base = 1500/this.speed
		this.listen_activation_intereval_current = this.listen_activation_intereval_base
		this.input_timeout = 10000/(this.speed/2.5)
	}

	update_pre(dt: number) {
		//console.log("Simon: PRE:", this.pre_waiting_ms_current)				
		this.pre_waiting_ms_current -= dt*1000
		if (this.pre_waiting_ms_current < 0) {
			this.text.text = "ERROR: \nDUMPING \nMEMORY"
			this.text.style = {fill: "orange"}
			this.state = SimonState.LISTEN
		}
	}

	update_listen(dt: number) {
		//console.log("Simon: LISTEN:", this.listen_activation_intereval_current, this.sequence_listen)
		this.listen_activation_intereval_current -= dt*1000
		if (this.listen_activation_intereval_current < 0) {
			// sequence ended => user has to input
			if (this.sequence_listen.length === 0) {
				this.text.text = "INSERT \nMISSING \nSEQUENCE"
				this.text.style = {fill: "white"}
				this.state = SimonState.INPUT
				//console.log("to input")

				return
			}
			// sequence still ongoing => "press" next key and wait again
			this.listen_activation_intereval_current = this.listen_activation_intereval_base
			const currentKey = this.sequence_listen.pop() || Key.S
			this.handleEvent(currentKey)
		}
	}

	update_input(dt: number) {
		//console.log("Simon: INPUT:", this.input_timeout)
		this.input_timeout -= dt*1000
		if(this.input_timeout < 3000){
			this.text.style.fill = "yellow"
			this.text.alpha = (this.text.alpha + dt ) % 1.0

		}
		if (this.input_timeout < 0) {
		//	console.log("to post")
			this.text.text = "TIME OUT"
			this.text.alpha = 1
			this.text.style = {fill: "red"}
			// if ends without this.win=true => lose
			this.state = SimonState.POST
		}
	}

	update_post(dt: number) {
		//console.log("Simon: POST:", this.post_waiting_ms_current)
		this.post_waiting_ms_current -= dt*1000
		if(this.post_waiting_ms_current < 0) {
			this.deactivated = true
		}
	}

	update_key_activation(dt: number) {
		for(const key in this.key_activation) {
			this.key_activation[key] = Math.max(this.key_min_activation, this.key_activation[key]-dt*1000/2)
		}
	}

	update(dt: number) {
//		console.log(this.state, this.pre_waiting_ms_current)
		this.update_key_activation(dt)
		switch(this.state){
			case SimonState.PRE:
				this.update_pre(dt)
				return
			case SimonState.LISTEN:
				this.update_listen(dt)
				return
			case SimonState.INPUT:
				this.update_input(dt)
				return
			case SimonState.POST:
				this.update_post(dt)
				return
		}
	}

	draw_button(stage, x: number, y: number, size: number, color: number, activation: number) {
		const graphics = new PIXI.Graphics();
		// Set the fill color
		graphics.beginFill(color)
		// drawRect(x, y, width, height)
		graphics.drawRect(x, y, size, size)
		graphics.alpha = Util.mapRange(
			activation,
			0, 100,
			0, 1.0
		)
		graphics.endFill()
		stage.addChild(graphics)
	}

	draw_simon(stage){
		const w = this.size[0]
		const h = this.size[1]

		const squareSize = 40
		const margin = 5
		const simonCenter = [w/2 + w/6, h/2-squareSize/2]

		const separation = (squareSize + margin/2)

			  
		// UP/W ssquare 
		this.draw_button(
			stage, 
			simonCenter[0], simonCenter[1]-separation/2, 
			squareSize,
			0xe74c3c,
			this.key_activation[Key.W]
		)

		// DOWN/S square
		this.draw_button(
			stage, 
			simonCenter[0], simonCenter[1]+separation/2,  
			squareSize,
			0xe74c3c,
			this.key_activation[Key.S]
		)
		// LEFT/A square
		this.draw_button(
			stage, 
			simonCenter[0]-separation, simonCenter[1],  
			squareSize,
			0xe74c3c,
			this.key_activation[Key.A]
		)
		// RIGHT/D square
		this.draw_button(
			stage, 
			simonCenter[0]+separation, simonCenter[1],  
			squareSize,
			0xe74c3c,
			this.key_activation[Key.D]
		)
	}

	draw_game() {
		const w = this.size[0]
		const h = this.size[1]
		// Create the main stage for your display objects
		const stage = new PIXI.Container()

		this.draw_simon(stage)

		this.game.renderer.render(stage, this.texture, false)
	}

	handleEvent(key: Key) {
		switch(key){
			case Key.A:
				this.game.audio.playEffect(Effect.SIMON_A)
				break;
			case Key.S:
				this.game.audio.playEffect(Effect.SIMON_B)
				break;
			case Key.D:
				this.game.audio.playEffect(Effect.SIMON_C)
				break;
			case Key.W:
				this.game.audio.playEffect(Effect.SIMON_D)
				break;
		}
		this.key_activation[key] = this.key_max_activation
	}

	event(key: Key) {
		if (this.state !== SimonState.INPUT) 
			return

		const next = this.sequence_input.pop()
		// entered key is not the next in the sequence
		if (key !== next) {
			this.text.alpha = 1
			this.text.text = "CRC CHECK FAILED"
			this.text.style = {fill: "red"}
			// ends without winning
			this.state = SimonState.POST
		} else if (this.sequence_input.length === 0) {
			this.text.text = "SYSTEM RECOVERED"
			this.text.alpha = 1
			this.text.style = {fill: "green"}
			this.win = true
			this.state = SimonState.POST
		}

		this.handleEvent(key)
	}
}
