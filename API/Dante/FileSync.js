const fs = require("graceful-fs");

const readFile = fs.readFileSync;
const writeFile = fs.writeFileSync;

module.exports = class FileSync {
	constructor(
		source,
		{ defaultValue = {}, serialize = stringify, deserialize = JSON.parse } = {}
	) {
		this.source = source;
		this.defaultValue = defaultValue;
		this.serialize = serialize;
		this.deserialize = deserialize;
	}

	read() {
		if (fs.existsSync(this.source)) {
			try {
				const data = readFile(this.source, "utf-8").trim();
				return data ? this.deserialize(data) : this.defaultValue;
			} catch (e) {
				if (e instanceof SyntaxError) {
					e.message = `Malformed JSON in file: ${this.source}\n${e.message}`;
				}
				throw e;
			}
		} else {
			writeFile(this.source, this.serialize(this.defaultValue));
			return this.defaultValue;
		}
	}

	write(data) {
		return writeFile(this.source, this.serialize(data));
	}
};

function stringify(obj) {
	return JSON.stringify(obj, null, 2);
}
