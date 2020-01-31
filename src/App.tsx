import React from 'react'
import { render } from 'react-dom'

import Menu from "components/View/Menu/Menu"
import Toggle from "components/Toggle/Toggle"
import Futile from "components/Game/Futile/Futile"
import { AppContext } from "./AppContext"


import "./style.scss"

export const enum AppView {
	MAIN_MENU,
	CLASSIC_GAME,
	NON_FUTILE_LIST,
	ABOUT
}

interface AppState {
	view: AppView
}

class App extends React.Component<{}, AppState> {
	state = {
		view: AppView.MAIN_MENU
	}

	changeView(view: AppView) {
		this.setState({ view })
	}

	contextImp() {
		return {
			changeView: this.changeView
		}
	}

	renderViewElement() {
		const { view } = this.state
		const isOpen = {
			menu: view === AppView.MAIN_MENU,
			classicGame: view === AppView.CLASSIC_GAME,
			nonFutileList: view === AppView.NON_FUTILE_LIST,
			about: view === AppView.ABOUT,
		}
		return(
			<div className="App-component__view">
				<AppContext.Provider value={this.contextImp()}>
					<Toggle open={isOpen.menu}>
						<Menu />
					</Toggle>
					<Toggle open={isOpen.classicGame}>
						<Futile />
					</Toggle>
				</AppContext.Provider>
			</div>
		)
	}

	render() {
		return (
			<div className="App-component">
				{ this.renderViewElement() }
			</div>
		)
	}
}

render(<App />, document.getElementById('app'));