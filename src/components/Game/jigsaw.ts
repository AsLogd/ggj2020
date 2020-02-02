import * as PIXI from "pixi.js"
import Screen from "./screen"
import { Key, MinigameType } from "./types"

import { map } from "./assets"


function opposite(key) {
    if (key === Key.Up) {
	return Key.Down
    }
    if (key === Key.Down) {
	return Key.Up
    }
    if (key === Key.Left) {
	return Key.Right
    }
    if (key === Key.Right) {
	return Key.Left
    }
}


export default class JigsawPuzzle extends Screen {
    constructor(game, pos, size) {
        this.keys = [Key.Up, Key.Down, Key.Left, Key.Right]
        super(game, pos, size, MinigameType.JIGSAW_PUZZLE, this.keys)
	this.puzzle_sprites = []

	this.puzzle_sprite = PIXI.Sprite.from(map)
	
	this.puzzle = []

	for (let i = 0; i < 3; ++i) {
	    this.puzzle[i] = []
	    for (let j = 0; j < 3; ++j) {
		this.puzzle[i][j] = i * 3 + j 
	    }
	}

	this.puzzle[2][2] = null
	this.current_hole = [2, 2]
    }

    initialize(difficulty: number) {
	// scramble the pieces
	let iters = 0
	let last_move = null

	while (iters < difficulty * 2) {
	    const rand_move = Math.round(Math.random() * 4)
	    const move = this.keys[rand_move]

	    // Prevent going back to previous state
	    if (last_move && last_move === opposite(move)) {
		continue
	    }

	    const ch_x = this.current_hole[0]
	    const ch_y = this.current_hole[1]
	    this.event(move)

	    if (ch_x !== this.current_hole[0] || ch_y !== this.current_hole[1]) {
		iters += 1
	    }
	}
    }

    update(dt: number) {
	let curr = -1 
	for (let i = 0; i < 3; ++i) {
	    for (let j = 0; j < 3; ++j) {
		if (i === 2 && j === 2) {
		    continue;
		}

		if (this.puzzle[i][j] === curr + 1) {
		    curr += 1
		}
		else {
		    return;
		}
	    }
	}

	this.deactivated = true
    }

    draw_game() {
	const w = this.size[0]
	const h = this.size[1]

	const margin = 5 

	const th = (h - margin * 2)/3
	const tw = th

	let draw_count = 0

	for (let i = 0; i < 3; ++i) {
	    for (let j = 0; j < 3; ++j) {
		const idx = this.puzzle[i][j]
		if (idx === null) {
		    continue;
		}

		const x = j * tw + margin
		const y = i * th + margin

		const text_w = this.puzzle_sprite.texture.width / 3
		const text_h = this.puzzle_sprite.texture.height / 3

		const uv_x = (idx % 3) * text_w
		const uv_y = (Math.floor(idx / 3)) * text_h

		this.puzzle_sprite.width = tw
		this.puzzle_sprite.height = th
		this.puzzle_sprite.position.x = x
		this.puzzle_sprite.position.y = y
		this.puzzle_sprite.texture.frame = new PIXI.Rectangle(uv_x, uv_y, tw, th)

		this.game.renderer.render(this.puzzle_sprite, this.texture, false)
		draw_count += 1
	    }
	}
    }

    event(key: Key) {
	const ch = this.current_hole

	let changed = false

	if (key === Key.Down) {
	    if (this.current_hole[0] == 0) return;

	    this.puzzle[ch[0]][ch[1]] = this.puzzle[ch[0] - 1][ch[1]]
	    this.current_hole[0] -= 1
	    changed = true
	}
	else if (key === Key.Up) {
	    if (this.current_hole[0] == 2) return;

	    this.puzzle[ch[0]][ch[1]] = this.puzzle[ch[0] + 1][ch[1]]
	    this.current_hole[0] += 1
	    changed = true
	}
	else if (key === Key.Right) {
	    if (this.current_hole[1] == 0) return;

	    this.puzzle[ch[0]][ch[1]] = this.puzzle[ch[0]][ch[1] - 1]
	    this.current_hole[1] -= 1
	    changed = true
	}
	else if (key === Key.Left) {
	    if (this.current_hole[1] == 2) return;

	    this.puzzle[ch[0]][ch[1]] = this.puzzle[ch[0]][ch[1] + 1]
	    this.current_hole[1] += 1
	    changed = true
	}

	if (changed) {
	    const ch = this.current_hole
	    this.puzzle[ch[0]][ch[1]] = null
	}
    }
}
