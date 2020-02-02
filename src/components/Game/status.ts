import * as PIXI from "pixi.js"

import * as Util from "misc/Util"

import Screen from "./screen"
import { Key, MinigameType } from "./types"

import { map } from "./assets"

enum PartStatus {
	OK,
	DANGER,
	BROKEN
}

export  default class Status extends Screen {
	partAlive : PartStatus[]= [
		PartStatus.OK,
		PartStatus.OK,
		PartStatus.OK,
		PartStatus.OK,
	]
	constructor(game, pos, size) {
		super(game, pos, size, MinigameType.STATUS, [])
	}

	initialize(difficulty: number) { 

	}

	destroyPart(){
		// TODO: from endangered, not from ok
		this.partAlive[this.partAlive.findIndex((x) => x === PartStatus.OK)] = PartStatus.BROKEN
	}

	revivePart(){
		this.partAlive[this.partAlive.findIndex((x) => x === PartStatus.BROKEN)] = PartStatus.OK
	}

	update(dt: number) {
		this.deactivated = false
		const partsAlive = this.partAlive.reduce((prev, curr) => { return prev + (curr === PartStatus.OK ? 1 : 0) }, 0)
		if(this.game.lives < partsAlive) {
			this.destroyPart()
		} else if (this.game.lives > partsAlive) {
			this.revivePart()
		}

		// TODO: mark endangered parts (a game is running)
	}

	create_triangle(i, xPos, yPos, width, angle) {
	  var triangle = new PIXI.Graphics();

	  triangle.x = xPos;
	  triangle.y = yPos;

	  var triangleWidth = width,
	      triangleHeight = triangleWidth,
	      triangleHalfway = triangleWidth/2;

	  // draw triangle 
	  if(this.partAlive[i] === PartStatus.OK)
	  {
	  	triangle.beginFill(0x00FF00, 1);
	  	triangle.lineStyle(0, 0x00AA00, 1);
	  } else if(this.partAlive[i] === PartStatus.DANGER) {
	  	triangle.beginFill(0x00FFFF, 1);
	  	triangle.lineStyle(0, 0x00AAAA, 1);
	  } else {
	  	triangle.beginFill(0xFF0000, 1);
	  }
	  triangle.moveTo(triangleWidth, 0);
	  triangle.lineTo(triangleHalfway, triangleHeight); 
	  triangle.lineTo(0, 0);
	  triangle.lineTo(triangleHalfway, 0);
	  triangle.endFill();
	  triangle.angle = angle
	  return triangle
	}

	draw_ship(stage) {
		const w = this.size[0]
		const h = this.size[1]

		const partSize = 80
		const margin = 5
		const shipPosition = [w/2+partSize/2, h/2+partSize]

	  	var shield = new PIXI.Graphics();
	  	shield.lineStyle(4, 0xAAAAFF, 1);
	  	shield.drawCircle(shipPosition[0]-partSize/2, shipPosition[1]-partSize, 130)
	  	shield.endFill()
	  	shield.alpha = Util.mapRange(
	  		this.game.shield_activation
	  		0, 100,
	  		0, 1
	  	)
	  	stage.addChild(shield)
		//top
		stage.addChild(this.create_triangle(0,shipPosition[0], shipPosition[1]-partSize-margin/2, partSize, 180))
		//left
		stage.addChild(this.create_triangle(1,shipPosition[0]-partSize/2-margin/2, shipPosition[1], partSize, 180))
		//right
		stage.addChild(this.create_triangle(2,shipPosition[0]+partSize/2+margin/2, shipPosition[1], partSize, 180))
		//center
		stage.addChild(this.create_triangle(3,shipPosition[0]-partSize, shipPosition[1]-partSize, partSize, 0))



	}

	draw_score(stage){
		const w = this.size[0]
		const h = this.size[1]
		const text_style = new PIXI.TextStyle({
		    fontFamily: 'Commodore',
		    fontSize: 26,
		    fill: '#ffb72a',
		    wordWrap: true,
		    wordWrapWidth: 440,
		    align: "left"
		});
	    const text = new PIXI.Text(this.game.score, text_style)
	    text.position.set(100, h-50 )
	    stage.addChild(text)

	}

	draw_game() {
		const stage = new PIXI.Container()

		this.draw_ship(stage)
		this.draw_score(stage)

		this.game.renderer.render(stage, this.texture, false)
	}

	event(key: Key) { }
}
