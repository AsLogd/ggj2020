import * as React from "react"

import {AppView} from "../../../App"
import { AppContext, AppContextType } from "../../../AppContext"

const nau = require("../../../../public/nau.png")


import "./style.scss"

export default class Menu extends React.PureComponent<{}, {}> {
	static contextType = AppContext
	declare context: React.ContextType<React.Context<AppContextType>>

	handleChangeView = (view: AppView) => () => {
		this.context.changeView(view)
	}

	render() {
		const handler = {
			game: this.handleChangeView(AppView.GAME),
			about: this.handleChangeView(AppView.ABOUT),
		}
		return(
			<div className="Menu-component">
				<img src={nau} className="nau" />
				<h1>Repair simulator 2020: The broken edition</h1>
				<ul>
					<li onClick={handler.game}>
						Start
					</li>
					<li onClick={handler.about}>
						About
					</li>
				</ul>
			</div>
		)
	}
}