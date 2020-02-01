import Screen from "./screen"
import { Key, MinigameType } from "./types"

import { potato } from "./assets"


export default class JigsawPuzzle extends Screen {
    constructor(game, pos, size) {
        const keys = [Key.Up, Key.Down, Key.Left, Key.Right]
        super(game, pos, size, MinigameType.JIGSAW_PUZZLE, keys)
    }

    update(dt: number) {

    }

    draw_game() {
        // this.game.canvas.fillStyle = 'red'
        // this.game.canvas.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1])
    }

    event(key: Key) {
        // TODO(Marce): 
    }
}
