"use strict";

class ReconnectSys {
	constructor(min = 500, max = null, jitter = true) {
		this.min = min;
		this.max = max != null ? max : min * 10;
		this.jitter = jitter;

		this._current = min;
		this._timeoutId = null;
		this._fails = 0;
	}

	get fails() {
		return this._fails;
	}

	get current() {
		return this._current;
	}

	get pending() {
		return this._timeoutId != null;
	}

	succeed() {
		this.cancel();
		this._fails = 0;
		this._current = this.min;
	}

	fail(callback) {
		this._fails += 1;
		let delay = this._current * 2;

		if (this.jitter) {
			delay *= Math.random();
		}

		this._current = Math.min(this._current + delay, this.max);
		if (callback != null) {
			if (this._timeoutId != null) {
				throw new Error("callback already pending");
			}
			this._timeoutId = setTimeout(() => {
				try {
					if (callback != null) {
						callback();
					}
				} finally {
					this._timeoutId = null;
				}
			}, this._current);
		}

		return this._current;
	}

	cancel() {
		if (this._timeoutId != null) {
			clearTimeout(this._timeoutId);
			this._timeoutId = null;
		}
	}
}

function doAABBsOverlap(a, b) {
	const ax1 = a.position.x + a.size.width;
	const bx1 = b.x + b.width;
	const ay1 = a.position.y + a.size.height;
	const by1 = b.y + b.height;

	// Prenda a para b, veja se não está vazio
	const cx0 = a.position.x < b.x ? b.x : a.position.x;
	const cx1 = ax1 < bx1 ? ax1 : bx1;
	if (cx1 - cx0 > 0) {
		const cy0 = a.position.y < b.y ? b.y : a.position.y;
		const cy1 = ay1 < by1 ? ay1 : by1;
		if (cy1 - cy0 > 0) {
			return true;
		}
	}

	return false;
}

module.exports = {
	ReconnectSys,
	doAABBsOverlap
};
