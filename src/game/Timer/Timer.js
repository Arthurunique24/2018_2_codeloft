export default class Timer {
	constructor(duration) {
		this._duration = duration;
		this._passed = 0;
		this.ticker = this.tick.bind(this);
	}

	start() {
		this.tickLoop = setInterval(this.ticker, 1000);
	}

	tick() {
		this._passed++;
		this.check();
	}

	getPassedTime() {
		return this._passed;
	}

	addDuration(sec) {
		this._duration += sec;
	}

	check() {
		if (this._duration <= this._passed) {
			this.stop();
		}
	}

	stop() {
		clearInterval(this.tickLoop);
	}
}