import * as PIXI from "pixi.js"

import Audio, {Song, Effect} from "./audio"
import Screen from "./screen"
import JigsawPuzzle from "./jigsaw"
import SimonSays from "./simon"
import VertexPuzzle from "./vertex"
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

	this.background = PIXI.Sprite.from(background_image)
	this.background.tint = 0x666666
	this.stage.addChild(this.background)

	this.time_between_minigames = 15
	this.time_until_next_minigame = 5
	this.total_time = 0

	this.booting = true

	this.keys = {}

	this.minigames = {
	    [MinigameType.JIGSAW_PUZZLE]: new JigsawPuzzle(this, [440, 430], [390, 180]),
	    [MinigameType.VERTEX_COUNT]: new VertexPuzzle(this, [440, 65], [390, 245]),
	    [MinigameType.SIMON_SAYS]: new SimonSays(this, [60, 510], [320, 110]),
	}

	const texture = this.minigames[MinigameType.JIGSAW_PUZZLE].texture
	this.one_screen = PIXI.Sprite.from(texture)

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

    update(dt) {
	this.total_time += dt
	this.update_difficulty()

	this.time_until_next_minigame -= dt

	if (this.alarm_mode) {
	    this.background.tint = (Math.cos(this.total_time * 4) * 0x66 + 0x66) << 16
	}
	else {
	    if (this.background.tint < 0x666666) {
		this.background.tint += 0x010101
	    } else {
		this.background.tint = 0x666666
	    }
	}

	// Screen shake
	const far_x = this.stage.position.x - 0
	const far_y = this.stage.position.y - 0

	this.stage.position.x += (Math.random() - (0.5 + far_x * 0.1)) * 2.5
	this.stage.position.y += (Math.random() - (0.5 + far_y * 0.1)) * 2.5

	this.minigames[MinigameType.JIGSAW_PUZZLE].update(dt)
	this.minigames[MinigameType.SIMON_SAYS].update(dt)

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
	this.minigames[MinigameType.SIMON_SAYS].draw()


	this.renderer.render(this.stage)
    }

    booting_end() {
	this.alarm_mode = false
	this.booting = false
	this.background.tint += 0x000000
    }

    spawn_minigame() {
	const non_running_minigames = []

	for (const ty in MinigameType) {
	    if (this.minigames[MinigameType[ty]].deactivated) {
		non_running_minigames.push(ty)
	    }
	}

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
    			this.audio.playEffect(Effect.BULLET_IMPACT)
    			setTimeout(() => { this.audio.playEffect(Effect.EXPLOSION)}, 500)
    			break
    		case 1:
    			this.audio.playEffect(Effect.IMPACT_EXPLOSION, {pan: -0.5})
    			setTimeout(() => { this.audio.playEffect(Effect.RESENTING_HULL, {pan: -1})}, 100)
    			break
    		case 2:
    			this.audio.playEffect(Effect.LASER_BEAM)
    			setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan:-1})}, 300)
    			setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan: -0.8})}, 500)
    			setTimeout(() => { this.audio.playEffect(Effect.DEEP_EXPLOSION, {pan: -0.3})}, 500)
    			setTimeout(() => { this.audio.playEffect(Effect.EXPLOSION, {pan: 0})}, 800)
    			setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan: -0.3})}, 900)
    			setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan: -0.1})}, 1500)
    			setTimeout(() => { this.audio.playEffect(Effect.LASER_BEAM, {pan: 0})}, 2000)
    			break
    		case 3:
    			this.audio.playEffect(Effect.IMPACT_EXPLOSION, {pan: 0.6})
    			setTimeout(() => { this.audio.playEffect(Effect.DESTRUCTION, {pan: 0.7})}, 300)
    			setTimeout(() => { this.audio.playEffect(Effect.RESENTING_HULL, {pan: 1})}, 1000)
    			break
    		case 4:
    			this.audio.playEffect(Effect.BULLET_IMPACT, {pan: -0.5})
    			setTimeout(() => { this.audio.playEffect(Effect.BULLET_IMPACT, {pan: 0.5})}, 200)
    			setTimeout(() => { this.audio.playEffect(Effect.DESTRUCTION, {pan: 0.7})}, 300)
    			break
    	}
    }

    update_difficulty() {
	// TODO(Marce): Update time between minigames based on time
    }
}
