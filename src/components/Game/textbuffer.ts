export class TextBuffer {
    constructor(width, height, offset) {
	this.fontsize = 15
	this.width = width
	this.height = height

	this.rows = Math.floor(this.height / this.fontsize)
	this.columns = Math.floor(this.width / 11)

	this.buffer = []

	this.time = 0
    }

    update(dt: number) {
	this.time += dt
    }

    addLine(line: string) {
	this.buffer.push({time: this.time, text: line})

	if (this.buffer.length > this.rows) {
	    this.buffer.shift()
	}
    }

    addStatus(status: string) {
	const line = this.buffer[this.buffer.length - 1].text;
	const line_len = line.length

	const new_len = line_len + status.length + 2

	if (new_len > this.columns) {
	    // do shit
	}

	let new_line = line
	for (let i = 0; i < (this.columns - new_len); ++i) {
	    new_line = new_line + ' '
	}

	new_line = new_line + '[' + status + ']'
	this.buffer[this.buffer.length - 1].text = new_line
    }

    getText() {
	let text = ''
	for (let i = 0; i < this.buffer.length; ++i) {
	    const line = this.buffer[i]
	    const num_chars = (this.time - line.time)/0.1
	    text = text + '\n' + line.text.substring(0, num_chars)
	}

	return text
    }

    substituteLine(line: string) {
	this.buffer[this.buffer.length - 1] = { time: this.time, text: line  }
    }
}
