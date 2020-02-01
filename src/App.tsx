import React from 'react'
import { render } from 'react-dom'
import hotkeys from "hotkeys-js"

import Menu from "components/View/Menu/Menu"
import Toggle from "components/Toggle/Toggle"
import Repair from "components/Game/Repair"
import { AppContext } from "./AppContext"


import "./style.scss"

export const enum AppView {
	MAIN_MENU,
	GAME,
	ABOUT
}

interface AppState {
	view: AppView
}

class App extends React.Component<{}, AppState> {
	state = {
		view: AppView.MAIN_MENU
	}

	componentDidUpdate(){
		hotkeys("esc", (event) => {
			this.changeView(AppView.MAIN_MENU)
		})
	}

	changeView = (view: AppView) => {
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
			game: view === AppView.GAME,
			about: view === AppView.ABOUT,
		}
		return(
			<div className="App-component__view-container">
				<AppContext.Provider value={this.contextImp()}>
					<Toggle open={isOpen.menu} className="App-component__view">
						<Menu />
					</Toggle>
					<Toggle open={isOpen.game} className="App-component__view">
						<Repair />
					</Toggle>
					<Toggle open={isOpen.about} className="App-component__view App-component__view--about">
						<h1>The dudes</h1>
						<p>Aslo</p>
						<p>Marcelino</p>
						<p>Lali cama</p>
						<p>Veuske</p>
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