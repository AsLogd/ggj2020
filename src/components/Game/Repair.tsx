import React from "react"
import Game from "./game.ts"
import { AppContext, AppContextType } from "../../AppContext"


export default class Repair extends React.Component<{}> {
	static contextType = AppContext
	declare context: React.ContextType<React.Context<AppContextType>>

	canvas = React.createRef()
	game: Game | undefined = undefined

	last_time = 0

	componentDidMount() {
		this.game = new Game(this.canvas.current, this.context.getAudio())
		this.update(performance.now())
	}

	update(time) {
		const dt = (time - this.last_time) / 1000
		this.last_time = time

		this.game.update(dt)
		this.game.draw()

		requestAnimationFrame(this.update.bind(this))
	}

	render() {
		return (
			<canvas ref={this.canvas} width={1280} height={720}></canvas>
		)
	}
}
