import * as React from "react"

import {AppView} from "../../../App"
import { AppContext, AppContextType } from "../../../AppContext"

export default class Menu extends React.PureComponent<{}, {}> {
	static contextType = AppContext
	declare context: React.ContextType<React.Context<AppContextType>>

	handleChangeView = (view: AppView) => () => {
		this.context.changeView(view)
	}

	render() {
		const handler = {
			classic: this.handleChangeView(AppView.CLASSIC_GAME),
			nonFutile: this.handleChangeView(AppView.NON_FUTILE_LIST),
			about: this.handleChangeView(AppView.ABOUT),
		}
		return(
			<div className="Menu-component">
				<h1>The Futile Game</h1>
				<ul>
					<li onClick={handler.classic}>
						Classic
					</li>
					<li onClick={handler.nonFutile}>
						Non-futile
					</li>
					<li onClick={handler.about}>
						About
					</li>
				</ul>
			</div>
		)
	}
}