import * as PIXI from "pixi.js"

import Screen from "./screen"
import JigsawPuzzle from "./jigsaw"
import { MinigameType } from "./types"

import { potato } from "./assets"


export default class Game {
	canvas: HTMLCanvasElement
	time_between_minigames: number
	time_until_next_minigame: number
	total_time: number

	renderer: any

	stage: any

	keys: {}

	minigames: {}

	constructor(canvas) {
		PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(PIXI.settings.SPRITE_MAX_TEXTURES, 16);
		this.renderer = new PIXI.autoDetectRenderer({ width: 1280, height: 720, view: canvas })
		this.stage = new PIXI.Container()

		this.time_between_minigames = 3
		this.time_until_next_minigame = this.time_between_minigames
		this.total_time = 0

		this.keys = {}

		this.minigames = {
			[MinigameType.JIGSAW_PUZZLE]: new JigsawPuzzle(this, [100, 100], [300, 200]),
			[MinigameType.VERTEX_COUNT]: new JigsawPuzzle(this, [700, 140], [300, 200]),
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
