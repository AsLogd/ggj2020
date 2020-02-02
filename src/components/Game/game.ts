import * as PIXI from "pixi.js"

import Audio, {Song, Effect} from "./audio"
import Screen from "./screen"
import JigsawPuzzle from "./jigsaw"
import RedButton from "./red_button"
import SimonSays from "./simon"
import Status from "./status"
import VertexPuzzle, {VertexReal} from "./vertex"
import { MinigameType } from "./types"

import { background_image } from "./assets"


export default class Game {
    canvas: HTMLCanvasElement
    time_between_minigames: number
    time_until_next_minigame: number
    total_time: number

    renderer: any

    stage: any

    keys: {}

    minigames: {}

    audio: Audio

    constructor(canvas, audio) {
	this.audio = audio
	// TODO: if calling before menu song is playing, the menu song will override this song.
	// remove setTimeout when menu is rendred. Maybe wait for audio to be loaded and decoded before starting the game
	setTimeout(() => {
		this.audio.playSong(Song.PLAYING)
	}, 3000)

	PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(PIXI.settings.SPRITE_MAX_TEXTURES, 16);
	this.renderer = new PIXI.autoDetectRenderer({ width: 1280, height: 720, view: canvas })
	this.stage = new PIXI.Container()
	this.stage.children.sort((a, b) => {
	    return Math.random() < 0.5
	})

	this.correction_dampening = 0.7
	this.shaking_distance = 2.5

	this.background = PIXI.Sprite.from(background_image)
	this.background.tint = 0x666666
	this.stage.addChild(this.background)

	this.time_between_minigames = 15
	this.time_until_next_minigame = 5
	this.total_time = 0

	this.booting = true

	this.lives = 4

	this.keys = {}

	this.minigames = {
	    [MinigameType.JIGSAW_PUZZLE]: new JigsawPuzzle(this, [440, 430], [390, 180]),
	    [MinigameType.VERTEX_COUNT]: new VertexPuzzle(this, [440, 65], [390, 245]),
	    [MinigameType.SIMON_SAYS]: new SimonSays(this, [60, 510], [320, 110]),
	    [MinigameType.VERTEX_COUNT_REAL]: new VertexReal(this, [60, 65], [320, 285]),
	    [MinigameType.RED_BUTTON]: new RedButton(this, [1070, 545], [80, 80]),
	    [MinigameType.STATUS]: new Status(this, [900, 60], [310, 460]),

	}

	this.shield_activation = 0

	this.minigames[MinigameType.VERTEX_COUNT_REAL].booting = false
	this.minigames[MinigameType.RED_BUTTON].booting = false

	document.addEventListener('keydown', this.process_keypress.bind(this))

	this.alarm_mode = true
    }

    process_keypress(ev) {
	const mgt = this.keys[ev.key];

	if (mgt !== undefined) {
	    const mg = this.minigames[mgt]
	    if (mg) {
		mg.event(ev.key)
	    }
	}
    }

    loseLife() {
	this.lives -= 1
    }

    winLife() {
	this.lives = Math.min(5, this.lives+1)
    }

    ambientAudio() {
    	const c = Math.floor(Math.random()*350)
    	switch(c)
    	{
    		case 0:
    			this.audio.playEffect(Effect.LASER_BEAM, {pan:-1})
    			setTimeout(() => { this.audio.playEffect(Effect.FADED_BEEP, {pan: -0.8, rate: 0.8, volume:0.5})}, 100)
    			this.shield_activation = 100
    			break
    		case 1:
				setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan:0.2, rate: 1.5, volume:0.5})}, 100)
    			setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan: 0.7, rate: 1.3, volume:0.3})}, 1000)
    			setTimeout(() => { this.audio.playEffect(Effect.FADED_BEEP, {pan:1, rate:1.3,volume:0.5})}, 1000)
    			this.shield_activation = 100
    			break
    		case 1:
				setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan:0.2, rate: 1.5, volume:0.5})}, 100)
    			setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan: 0.7, rate: 1.2, volume:0.6})}, 200)
    			setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan: 0.7, rate: 0.9, volume:0.7})}, 400)
    			setTimeout(() => { this.audio.playEffect(Effect.FADED_BEEP, {pan:1,volume:0.5})}, 450)
    			this.shield_activation = 100
    			break
    	}
    	if(this.lives <= 2) {
    		const c2 = Math.floor(Math.random()*300)
	    	switch(c2)
	    	{
	    		case 0:
	    			this.audio.playEffect(Effect.RESENTING_HULL, {pan:-1, rate: 0.6, volume:0.4})
	    			setTimeout(() => { this.audio.playEffect(Effect.RESENTING_HULL, {pan:0.8, volume:0.3, rate:0.2})}, 1000)
	    			break
	    		case 1:
	    			this.audio.playEffect(Effect.RESENTING_HULL, {pan:1, rate: 0.3, volume:0.4})
	    			setTimeout(() => { this.audio.playEffect(Effect.RESENTING_HULL, {pan:-0.8, volume:0.2, rate:0.5})}, 1000)
	    			break
	    		case 2:
					setTimeout(() => { this.audio.playEffect(Effect.PIXEL_EXPLOSION, {volume:0.3})}, 100)
	    			setTimeout(() => { this.audio.playEffect(Effect.PIXEL_EXPLOSION, {volume:0.3})}, 200)
	    			setTimeout(() => { this.audio.playEffect(Effect.PIXEL_EXPLOSION, {volume:0.3})}, 300)
	    			break
	    		case 3:
	    			this.audio.playEffect(Effect.LONG_BEEP, {volume:0.5})
	    			break
	    	}	
    	}
    }

    update(dt) {
	this.total_time += dt
	this.update_difficulty()

	this.shield_activation = Math.max(0, this.shield_activation - dt*100)
	this.ambientAudio()

	if (this.lives <= 0) {
	    this.lost = true
	}
	if(this.lives < 2){
		this.alarm_mode = true
	} else if(!this.booting) {
		this.alarm_mode = false
	}

	if (!this.booting) {
	    this.time_until_next_minigame -= dt
	}

	if (this.alarm_mode) {
	    this.background.tint = (Math.cos(this.total_time * 4) * 0x66 + 0x66) << 16
	}
	else {
	    if (this.background.tint <  0x666666) {
		this.background.tint += 0x010101
	    } else {
		this.background.tint = 0x666666
	    }
	}

	// Screen shake
	const far_x = this.stage.position.x - 0
	const far_y = this.stage.position.y - 0

	this.stage.position.x += (Math.random() - (0.5 + far_x * this.correction_dampening)) * this.shaking_distance 
	this.stage.position.y += (Math.random() - (0.5 + far_y * this.correction_dampening)) * this.shaking_distance 

	if (this.lost) {
		this.audio.playSong(Song.DEAD)
	    this.minigames[MinigameType.JIGSAW_PUZZLE].sprite.rotation = 0.5 + Math.cos(this.total_time) * 0.1
	    this.minigames[MinigameType.VERTEX_COUNT_REAL].sprite.rotation = 0.5 + Math.cos(this.total_time + 4) * 0.1
	    this.minigames[MinigameType.VERTEX_COUNT].sprite.rotation = 0.5 + Math.cos(this.total_time + 10) * 0.1
	    this.minigames[MinigameType.SIMON_SAYS].sprite.rotation = 0.5 + Math.cos(this.total_time + 7) * 0.1
	}

	this.minigames[MinigameType.JIGSAW_PUZZLE].update(dt)
	this.minigames[MinigameType.VERTEX_COUNT].update(dt)
	this.minigames[MinigameType.VERTEX_COUNT_REAL].update(dt)
	this.minigames[MinigameType.SIMON_SAYS].update(dt)
	this.minigames[MinigameType.RED_BUTTON].update(dt)
	this.minigames[MinigameType.STATUS].update(dt)

	if (this.time_until_next_minigame <= 0) {
	    this.time_until_next_minigame = this.time_between_minigames
	    this.spawn_minigame()
	}
    }

    register_keys(minigame, keys) {
	for (const key of keys) {
	    if (this.keys[key] !== undefined && this.keys[key] !== minigame) {
		console.error("Keybind collision")
	    }

	    this.keys[key] = minigame
	}
    }

    draw() {
	this.minigames[MinigameType.JIGSAW_PUZZLE].draw()
	this.minigames[MinigameType.VERTEX_COUNT].draw()
	this.minigames[MinigameType.VERTEX_COUNT_REAL].draw()
	this.minigames[MinigameType.SIMON_SAYS].draw()
	this.minigames[MinigameType.RED_BUTTON].draw()
	this.minigames[MinigameType.STATUS].draw()

	this.renderer.render(this.stage)
    }

    booting_end() {
	this.alarm_mode = false
	this.booting = false
	this.background.tint += 0x000000
	this.correction_dampening = 0.1
	this.shaking_distance = 2.5
    }

    spawn_minigame() {
	const non_running_minigames = []

	for (const ty in MinigameType) {
	    if (this.minigames[MinigameType[ty]].deactivated) {
		non_running_minigames.push(ty)
	    }
	}

	//Jinch
	non_running_minigames.push("RED_BUTTON")

	const num_nrm = non_running_minigames.length

	if (num_nrm === 0) {
	    return
	}

	const random_type_idx = Math.floor(Math.random() * num_nrm)
	const random_type = non_running_minigames[random_type_idx]
	const random_type_name = MinigameType[random_type]


	this.minigames[random_type_name].activate(3)
	this.playImpactEffect()
    }

    playImpactEffect(){
    	const c = Math.floor(Math.random()*5)
    	switch(c)
    	{
    		case 0:
    			this.audio.playEffect(Effect.BULLET_IMPACT,{volume:0.3, rate: 1.1})
    			setTimeout(() => this.audio.playEffect(Effect.BULLET_IMPACT,{volume:0.6, rate: 1.3}), 200)
    			setTimeout(() => this.audio.playEffect(Effect.BULLET_IMPACT,{rate: 1.5}), 300)
    			setTimeout(() => { this.audio.playEffect(Effect.EXPLOSION)}, 400)
    			break
    		case 1:
    			this.audio.playEffect(Effect.IMPACT_EXPLOSION, {pan: -0.5})
    			setTimeout(() => { this.audio.playEffect(Effect.RESENTING_HULL, {pan: -1})}, 100)
    			break
    		case 2:
    			this.audio.playEffect(Effect.LASER_BEAM, {pan:-1})
    			setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan:-1, volume: 0.3})}, 300)
    			setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan: -0.8, volume: 0.5})}, 500)
    			setTimeout(() => { this.audio.playEffect(Effect.DEEP_EXPLOSION, {pan: -0.3})}, 500)
    			setTimeout(() => { this.audio.playEffect(Effect.EXPLOSION, {pan: 0})}, 800)
    			break
    		case 3:
    			this.audio.playEffect(Effect.BULLET_IMPACT,{volume:0.3, rate: 1.1, pan: 0.4})
    			setTimeout(() => { this.audio.playEffect(Effect.IMPACT_EXPLOSION, {pan: 0.6})}, 300)
    			setTimeout(() => { this.audio.playEffect(Effect.DESTRUCTION, {pan: 0.7})}, 300)
    			setTimeout(() => { this.audio.playEffect(Effect.RESENTING_HULL, {pan: 1})}, 1000)
    			break
    		case 4:
    			this.audio.playEffect(Effect.BULLET_IMPACT, {pan: -0.5})
    			setTimeout(() => { this.audio.playEffect(Effect.BULLET_IMPACT, {pan: 0.5})}, 200)
    			setTimeout(() => { this.audio.playEffect(Effect.DESTRUCTION, {pan: 0.7})}, 300)
    			setTimeout(() => { this.audio.playEffect(Effect.RESENTING_HULL, {rate: 1.5})}, 400)

    			break
    	}
    }

    update_difficulty() {
	// TODO(Marce): Update time between minigames based on time
    }
}
