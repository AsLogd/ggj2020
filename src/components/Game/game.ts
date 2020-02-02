import * as PIXI from "pixi.js"

import Audio, {Song} from "./audio"
import Screen from "./screen"
import JigsawPuzzle from "./jigsaw"
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

	this.correction_dampening = 0.7
	this.shaking_distance = 2.5

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
	    [MinigameType.SIMON_SAYS]: new JigsawPuzzle(this, [150, 400], [200, 200]),
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

	this.minigames[MinigameType.JIGSAW_PUZZLE].update(dt)

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

	const num_nrm = non_running_minigames.length

	if (num_nrm === 0) {
	    return
	}

	const random_type_idx = Math.floor(Math.random() * num_nrm)
	const random_type = non_running_minigames[random_type_idx]
	const random_type_name = MinigameType[random_type]

//	this.minigames[random_type_name].activate(3)
    }

    update_difficulty() {
	// TODO(Marce): Update time between minigames based on time
    }
}
