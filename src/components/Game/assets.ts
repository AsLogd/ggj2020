import * as PIXI from "pixi.js"

export const potato = require("../../../public/potato.png")
export const map = require("../../../public/map.jpeg")

export const screen_frag = require("./screen.frag")
export const font = require("../../../public/Commodore Pixelized v1.2.ttf")

export const background_image = require("../../../public/GAMEJAM_2020_MAIN.png")

const loader = new PIXI.Loader();
loader.add('screen_font', font);
