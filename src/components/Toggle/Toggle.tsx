import React from "react"

import * as Util from "misc/Util"

import "./style.scss"

export enum AnimationState {
	CLOSED,
	OPEN,
	CLOSING,
	OPENING,
	PREOPENING
}

interface ToggleState {
	animState: AnimationState
}

interface ToggleProps {
	open: boolean

	/** If true, mounts the children even if closed (default false) */
	keepMounted?: boolean
	/** if not set, uses a basic fade-in/out transition */
	animation?: string
	className?: string
	onCloseEnd?: () => void
	onOpenEnd?: () => void
}

export default class Toggle extends React.Component<ToggleProps, ToggleState>{
	ref: React.RefObject<HTMLDivElement> = React.createRef()
	static defaultProps: Partial<ToggleProps> = {
		keepMounted: false
	}
	state = {
		// If open, set after component has mounted,
		// otherwise, we lose the animation
		animState: AnimationState.CLOSED
	}

	componentDidMount() {
		if (this.props.open) {
			Util.DOMreflow().then(() => {
				this.openFromClosed()
			})
		}
		if (this.ref.current) {
			this.ref.current.addEventListener("transitionend", this.handleTransitionEnd)
		}
	}

	componentDidUpdate(prevProps) {
		if(this.props.open !== prevProps.open) {
			this.toggle()
		}
	}

	handleTransitionEnd = (ev) => {
		if (this.state.animState === AnimationState.CLOSING) {
			// animating to close => final closed state
			this.setAnimState(AnimationState.CLOSED)
			if(this.props.onCloseEnd){
				Util.DOMreflow().then(() => {
					if(typeof this.props.onCloseEnd === "function")
						this.props.onCloseEnd()
				})
			}
		} else {
			// animating to open => final open state
			this.setAnimState(AnimationState.OPEN)
			if(this.props.onOpenEnd){
				Util.DOMreflow().then(() => {
					if(typeof this.props.onOpenEnd === "function")
						this.props.onOpenEnd()
				})
			}
		}
	}

	setAnimState(state: AnimationState) {
		this.setState({
			animState: state
		})
	}

	open() {
		// closed | closing => animating to open
		this.setAnimState(AnimationState.OPENING)
	}

	close() {
		// open | opening => animating to close
		this.setAnimState(AnimationState.CLOSING)
	}

	openFromClosed() {
		//unmounted => mounted (same style as closed, but mounted)
		this.setAnimState(AnimationState.PREOPENING)
		// Once the component is mounted, transition to open
		Util.DOMreflow().then(() => {
			this.open()
		})
	}


	toggle() {
		// We toggled the component open
		if(this.props.open) {
			if (this.state.animState === AnimationState.CLOSED) {
				this.openFromClosed()
			} else {
				this.open()
			}

		} else {
			this.close()
		}
	}

	render() {
		const animState = AnimationState[this.state.animState]
		const animation = this.props.animation || "fade"
		const className = this.props.className || ""
		const componentClassNames = `
			Animated-Toggle-component
			Animated-Toggle-component--${animation}
			Animated-Toggle-component--${className}
			Animated-Toggle-component--state-${animState}
		`
		// Render children if the component is not closed
		// or we want them always mounted
		const shouldRenderChildren = (
			this.state.animState !== AnimationState.CLOSED
			|| this.props.keepMounted
		)
		return(
			<div ref={this.ref} className={componentClassNames}>
			{
				shouldRenderChildren &&
				this.props.children
			}
			</div>
		)
	}
}