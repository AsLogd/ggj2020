import {Howl, Howler} from "howler"

export enum Song {
	MENU = "MENU",
	PLAYING ="PLAYING",
	//DEAD
}

export enum Effect {
	TEST1 ="TEST1",
	TEST2 ="TEST2",
}

//TODO: add webm audio assets
const songFileUrls = {
	[Song.MENU]: require("../../../public/audio/pixel_nemesis.ogg"),
	[Song.PLAYING]: require("../../../public/audio/subliminal_interpolation.ogg")
}

const effectSpriteSoundUrl = require("../../../public/audio/FX_File.ogg")

export default class Audio {
	songs: Howl[] = []
	songsDict = {}
	effects: Howl
	constructor() {
		for(const song in Song) {
			const h = new Howl({
				src: [ songFileUrls[song] ],
				loop: true
			})
			this.songs.push(h)
			this.songsDict[song] = h
		}
		this.effects = new Howl({
			src: [ effectSpriteSoundUrl ],
			sprite: {
				[Effect.TEST1]: [0, 3500],
				[Effect.TEST2]: [3500, 7000],
			}
		})
	}

	playSong(song: Song) {
		this.songs.map(s => s.stop())
		this.songsDict[song].play()
	}

	playEffect(effect: Effect) {
		this.effects.play(effect)
	}
}