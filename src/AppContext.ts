import * as React from "react"


import { AppView } from "./App"

export interface AppContextType {
	changeView: (view: AppView) => void
	getAudio: () => any
}

export const AppContext: React.Context<AppContextType> = React.createContext({
	changeView: (view: AppView) => {},
	getAudio: () => {}
})