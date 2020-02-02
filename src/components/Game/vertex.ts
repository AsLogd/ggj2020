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


export default class VertexPuzzle extends Screen {
    constructor(game, pos, size) {
        this.keys = []
        super(game, pos, size, MinigameType.VERTEX_COUNT, this.keys)
    }

    initialize(difficulty: number) {
    }

    update(dt: number) {
    }

    draw_game() {
    }

    event(key: Key) {
    }
}
