// Waits a couple of frames
export function DOMreflow(): Promise<any> {
	let frames = 2
	let resolve
	const p = new Promise((res) => {
		resolve = res
	})
	function frame() {
		frames--;
		if(!frames)
			resolve()
		else
			requestAnimationFrame(frame)
	}

	requestAnimationFrame(frame)
	return p
}

export function mapRange (value, in_min, in_max, out_min, out_max) {
	return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}