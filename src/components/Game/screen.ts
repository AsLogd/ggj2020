import * as PIXI from "pixi.js"

import { Key, MinigameType } from "./types"
import { potato, screen_frag } from "./assets"
import { TextBuffer } from "./textbuffer.ts"
import {CRTFilter} from '@pixi/filter-crt';
import {GlowFilter} from '@pixi/filter-glow';


const BOOT_SEQUENCE = {
    [MinigameType.VERTEX_COUNT]: [
	{text: "Booting DS/OS...", duration: 3},
	{text: "", duration: 3},
	{text: "Booting Slave computers", duration: 3},
	{text: "", duration: 3},
	{text: "Mounting system drives", duration: 2},
	{text: "FAILED", duration: 1, newline: false},
	{text: "Mounting backup drives", duration: 2},
	{text: "SUCCESS", duration: 2, newline: false},
	{text: "", duration: 3},
	{text: "Accessing DB restore point", duration: 2},
	{text: "Cleaning dangling references", duration: 4},
	{text: "Checking filesystem corruption", duration: 2},
	{text: "", duration: 3},
	{text: "", duration: 3},
	{text: ["0/34", "4/34", "12/34", "22/34", "28/34", "34/34"], duration: 5},
	{text: "", duration: 3},
	{text: "Completed", duration: 4},
	{text: "", duration: 3},
	{text: "Generating entropy", duration: 4},
    ],
    [MinigameType.JIGSAW_PUZZLE]: [
	{type: "bootup", duration: 15},
	{text: "Received boot request by DS/OS", duration: 3},
	{text: "Restoring last snapshot:", duration: 3},
	{text: "  12/04/2104.tar.gz", duration: 3},
	{text: "  13/04/2104.tar.gz", duration: 3},
	{text: "  18/04/2104.tar.gz", duration: 3},
	{text: "  22/04/2104.tar.gz", duration: 3},
	{text: "SELECTED", duration: 2, newline: false},
	{text: "", duration: 3},
	{text: "Restoring...", duration: 7},
	{text: "Restoring...", duration: 7},
	{text: "Restoring...", duration: 7},
	{text: "SUCCESS", duration: 5, newline: false},
	{text: "", duration: 3},
	{text: "Engine checkup", duration: 7},
	{text: " Pressure valve", duration: 5},
	{text: "OK", duration: 2, newline: false},
	{text: " Heat radiator", duration: 5},
	{text: "OK", duration: 2, newline: false},
	{text: " Fuel injection", duration: 5},
	{text: "OK", duration: 2, newline: false},
	{text: " Hyperlight Core", duration: 5},
	{text: "OK", duration: 2, newline: false},
	{text: "", duration: 3},
	{text: "General Engine Status", duration: 5},
	{text: "OK", duration: 2, newline: false},
	{text: "", duration: 1},
	{text: "", duration: 1},
	{text: "", duration: 1},
	{text: "Re-routing energy for shield", duration: 5},
    ],
    [MinigameType.SIMON_SAYS]: [
	{type: "bootup", duration: 30},
	{text: "Received boot request by DS/OS", duration: 3},
	{text: "", duration: 4},
	{text: "Checking current shield status", duration: 3},
	{text: "LEFT", duration: 5},
	{text: "OK", duration: 2, newline: false},
	{text: "RIGHT", duration: 5},
	{text: "OK", duration: 2, newline: false},
	{text: "FRONT", duration: 5},
	{text: "LIGHT DMG", duration: 2, newline: false},
	{text: "BACK", duration: 5},
	{text: "OK", duration: 2, newline: false},
	{text: "", duration: 4},
	{text: "Receiving energy from grid", duration: 4},
    ]
}

export default class Screen {
    deactivated: boolean;

    constructor(game, pos, size, minigametype, keys) {
	this.booting = true

	this.current_boot_idx = 0
	this.current_boot_time = 0

	this.game = game

	this.deactivated = true
	this.texture = PIXI.RenderTexture.create(size[0], size[1])
	this.sprite = PIXI.Sprite.from(this.texture)
	this.sprite.position = { x: pos[0], y: pos[1] }
	this.sprite.filters = [new GlowFilter()]

	this.game.stage.addChild(this.sprite)

	this.renderer = PIXI.autoDetectRenderer({
	    backgroundColor: 0xff0000
	})

	this.screen_tb = new TextBuffer(size[0], size[1])

	this.background = new PIXI.Graphics();

	this.background.beginFill(0x221205)
	this.background.drawRect(0, 0, size[0], size[1])
	this.background.endFill()

	this.bbackground = new PIXI.Graphics();

	this.bbackground.beginFill(0x000000)
	this.bbackground.drawRect(0, 0, size[0], size[1])
	this.bbackground.endFill()

	this.pos = pos
	this.size = size
	this.type = minigametype

	this.crt_filter = new CRTFilter({curvature: 2,
					 verticalLine: false,
					 lineContrast: 0.08,
					 vignettingAlpha: 0.5,
					 lineWidth: 20})
	this.sprite.filters = [this.crt_filter]
	this.background.filters = [this.crt_filter]

	this.game.register_keys(minigametype, keys)

	this.text_style = new PIXI.TextStyle({
	    fontFamily: 'Commodore',
	    fontSize: 14,
	    fill: '#ffb72a',
	    wordWrap: true,
	    wordWrapWidth: 440,
	});

	this.text = new PIXI.Text('Engine malfunction', this.text_style)
	this.text.filters = [this.crt_filter]
    }

    update(dt: number) {
    }

    activate(difficulty) {
	this.deactivated = false
	console.log(`Activated ${this.type}`)
	this.initialize(difficulty)
    }

    draw() {
	this.crt_filter.time += 0.1

	this.game.renderer.render(this.background, this.texture)

	if (this.deactivated) {
	    this.draw_idle()
	} else {
	    this.draw_game()
	    this.game.renderer.render(this.text, this.texture, false)
	}
    }

    draw_idle() {
	const r = this.game.renderer
	this.screen_tb.update(0.1)

	let skip_render = false;

	if (this.booting) {
	    if (this.current_boot_idx === BOOT_SEQUENCE[this.type].length) {
		this.booting = false
	    }
	    else {
		const curr_boot = BOOT_SEQUENCE[this.type][this.current_boot_idx]

		const is_bootup = curr_boot.type === "bootup"

		if (is_bootup) {
		    skip_render = true
		}

		const new_line = curr_boot.newline === undefined ? true : curr_boot.newline
		const is_same_line = Array.isArray(curr_boot.text)

		this.current_boot_time += 0.1

		if (this.current_boot_time >= curr_boot.duration) {
		    if (!is_same_line) {
			this.current_boot_idx += 1
			this.current_boot_time = 0

			if (!is_bootup) {
			    if (!new_line) {
				this.screen_tb.addStatus(curr_boot.text);
			    }
			    else {
				this.screen_tb.addLine(curr_boot.text)
			    }
			}
		    }
		    else {
			if (!is_bootup) {
			    const val = curr_boot.text.shift()

			    if (val === undefined) {
				this.current_boot_idx += 1
				this.current_boot_time = 0
			    }
			    else {
				this.screen_tb.substituteLine(val)
				this.current_boot_time = 0
			    }
			}
		    }

		}

	    }
	}

	if (!skip_render) {
	    this.text = new PIXI.Text(this.screen_tb.getText(), this.text_style)
	    r.render(this.text, this.texture, false)
	    r.render(this.sprite, this.texture, false)
	}
	else {
	    r.render(this.bbackground, this.texture)
	}
    }
}

