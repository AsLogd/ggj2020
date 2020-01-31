import React from "react"

/*
-quantic
-ultimate
*/

type Cell = null | "X" | "O"

type Board = Cell[][]

interface FutileState {
	board: Board
}

export default class Futile extends React.Component<{}, FutileState> {
	state = {
		board: [
			[null, null, null],
			[null, null, null],
			[null, null, null]
		]
	}

	handleCellClick = () => {

	}

	renderCell(cell: Cell) {
		return(
			<div
				className="Futile-component__cell"
				onClick={this.handleCellClick}
			>
				{cell}
			</div>
		)
	}

	renderBoard() {
		return(
			<div className="Futile-component__board">
			{
				this.state.board.map(row => {
					return row.map(cell => this.renderCell(cell))
				})
			}
			</div>
		)
	}

	render() {
		return(
			<div className="Futile-component">
				{ this.renderBoard() }
			</div>
		)
	}
}