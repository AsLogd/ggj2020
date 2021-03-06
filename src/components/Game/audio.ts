import {Howl, Howler} from "howler"

export enum Song {
	MENU = "MENU",
	PLAYING ="PLAYING",
	DEAD = "DEAD",
	GAME_OVER = "GAME_OVER"
}

export enum Effect {
	LONG_BEEP = "LONG_BEEP",
	BEEP_SEQUENCE = "BEEP_SEQUENCE",
	SONAR_BEEP = "SONAR_BEEP",
	FADED_BEEP = "FADED_BEEP",
	BEEP_LOSE = "BEEP_LOSE",
	BEEP_WIN = "BEEP_WIN",
	BEEP_RESTORE = "BEEP_RESTORE",
	COMPLEX_BEEP_LOSE = "COMPLEX_BEEP_LOSE",
	BULLET_IMPACT = "BULLET_IMPACT",
	EXPLOSION = "EXPLOSION",
	IMPACT_EXPLOSION = "IMPACT_EXPLOSION",
	DEEP_EXPLOSION = "DEEP_EXPLOSION",
	PIXEL_EXPLOSION = "PIXEL_EXPLOSION",
	RESENTING_HULL = "RESENTING_HULL",
	DESTRUCTION = "DESTRUCTION",
	LASER_BEAM = "LASER_BEAM",
	LONG_EFFECT = "LONG_EFFECT",
	DYING_BOT = "DYING_BOT",
	STATIC_RADIO = "STATIC_RADIO",
	SIMON_A = "SIMON_A",
	SIMON_B = "SIMON_B",
	SIMON_C = "SIMON_C",
	SIMON_D = "SIMON_D",
}

const effectData: {[t in Effect]: [number, number]} = {
	[Effect.LONG_BEEP]: 		[0,3400],
	[Effect.BEEP_SEQUENCE]: 	[10300,1050],
	[Effect.SONAR_BEEP]: 		[24000,2000],
	[Effect.FADED_BEEP]: 		[30800,2100],
	[Effect.BEEP_LOSE]: 		[34300,1100],
	[Effect.BEEP_WIN]: 			[37700,1100],
	[Effect.BEEP_RESTORE]: 		[48000,2500],
	[Effect.COMPLEX_BEEP_LOSE]: [51400,2300],
	[Effect.BULLET_IMPACT]: 	[3400,1100],
	[Effect.EXPLOSION]: 		[20500,2500],
	[Effect.IMPACT_EXPLOSION]: 	[6800,1771],
	[Effect.DEEP_EXPLOSION]: 	[13690,1810],
	[Effect.PIXEL_EXPLOSION]: 	[61600,500],
	[Effect.RESENTING_HULL]: 	[54800,2200],
	[Effect.DESTRUCTION]: 		[27400,3400],
	[Effect.LASER_BEAM]: 		[17100,500],
	[Effect.LONG_EFFECT]: 		[41100,3400],
	[Effect.DYING_BOT]: 		[44500,1200],
	[Effect.STATIC_RADIO]: 		[58300,300],
	[Effect.SIMON_A]:	 		[65200,1100],
	[Effect.SIMON_B]:	 		[68600,1100],
	[Effect.SIMON_C]:	 		[71900,1100],
	[Effect.SIMON_D]:	 		[75400,1100],
}

//TODO: add webm audio assets
const songFileUrls = {
	[Song.MENU]: require("../../../public/audio/pixel_nemesis.ogg"),
	[Song.PLAYING]: require("../../../public/audio/subliminal_interpolation.ogg"),
	[Song.DEAD]: require("../../../public/audio/energetic_breakdown.ogg"),
	[Song.GAME_OVER]: require("../../../public/audio/gameover.ogg"),
}

const effectSpriteSoundUrl = require("../../../public/audio/FX_File_ext.ogg")

interface AudioOptions {
	pos?: [number, number, number]
	pan?: number
	rate?: number
	volume?: number
}

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
			sprite: effectData
		})
		this.effects.pannerAttr({
			panningModel: 'HRTF',
			refDistance: 0.8,
			rolloffFactor: 2.5,
			distanceModel: "linear",
			maxDistance: 1000
		});
	}

	playSong(song: Song) {
		this.songs.map(s => s.stop())
		this.songsDict[song].play()
		console.log(this.songsDict, song)
	}

	playEffect(effect: Effect, opt?: AudioOptions) {
		const id = this.effects.play(effect)
		if(opt){
			if(opt.pos){
				const [x,y,z] = opt.pos
				this.effects.pos(x,y,z, id)
			}
			if(opt.pan) {
				this.effects.stereo(opt.pan, id)
			}
			if(opt.rate) {
				this.effects.rate(opt.rate, id)
			}
			if(opt.volume) {
				this.effects.volume(opt.volume, id)
			}
		}
	}
}