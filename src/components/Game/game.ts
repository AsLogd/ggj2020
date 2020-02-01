import * as PIXI from "pixi.js"

import Screen from "./screen"
import JigsawPuzzle from "./jigsaw"
import { MinigameType } from "./types"


export default class Game {
    canvas: HTMLCanvasElement
    time_between_minigames: number
    time_until_next_minigame: number
    total_time: number

    renderer: any

    keys: {}

    minigames: {}

    constructor(canvas) {
	PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(PIXI.settings.SPRITE_MAX_TEXTURES , 16);
	this.pixi = new PIXI.Application({width: 1280, height: 720, view: canvas})

	this.time_between_minigames = 3
	this.time_until_next_minigame = this.time_between_minigames
	this.total_time = 0

	this.renderer = PIXI.autoDetectRenderer()

	this.keys = {}

	this.minigames = {
	    [MinigameType.JIGSAW_PUZZLE]: new JigsawPuzzle(this, [100, 100], [200, 200]),
	    [MinigameType.VERTEX_COUNT]: new JigsawPuzzle(this, [300, 100], [200, 200]),
	    [MinigameType.SIMON_SAYS]: new JigsawPuzzle(this, [150, 400], [200, 200]),
	}

	this.one_screen = PIXI.Sprite.from(this.minigames[MinigameType.JIGSAW_PUZZLE].texture)
	// this.one_screen = PIXI.Sprite.from(potato)
	this.pixi.stage.addChild(this.one_screen)

	document.addEventListener('keydown', this.process_keypress.bind(this))

	this.pixi.ticker.add((delta) => {
	    this.update(delta)
	})
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

	if (this.time_until_next_minigame <= 0) {
	    this.time_until_next_minigame = this.time_between_minigames
	    // this.spawn_minigame()
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

	this.minigames[random_type_name].activate()
    }

    update_difficulty() {
	// TODO(Marce): Update time between minigames based on time
    }
}
