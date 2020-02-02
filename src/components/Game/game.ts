import * as PIXI from "pixi.js"

import Audio, {Song} from "./audio"
import Screen from "./screen"
import JigsawPuzzle from "./jigsaw"
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
	this.stage.addChild(this.background)

	this.time_between_minigames = 3
	this.time_until_next_minigame = this.time_between_minigames
	this.total_time = 0

	this.keys = {}

	this.minigames = {
	    [MinigameType.JIGSAW_PUZZLE]: new JigsawPuzzle(this, [440, 430], [400, 180]),
	    [MinigameType.VERTEX_COUNT]: new JigsawPuzzle(this, [440, 60], [400, 240]),
	    [MinigameType.SIMON_SAYS]: new JigsawPuzzle(this, [150, 400], [200, 200]),
	}


	const texture = this.minigames[MinigameType.JIGSAW_PUZZLE].texture
	this.one_screen = PIXI.Sprite.from(texture)

	document.addEventListener('keydown', this.process_keypress.bind(this))
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

	// Screen shake
	this.stage.position.x += (Math.random() - 0.5)
	this.stage.position.y += (Math.random() - 0.5)
	this.stage.position.z = -1

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
    }

    update_difficulty() {
	// TODO(Marce): Update time between minigames based on time
    }
}
