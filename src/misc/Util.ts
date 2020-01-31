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