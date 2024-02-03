function rangeRandom(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function lerp(start: number, end: number, t: number) {
	return start * (1 - t) + end * t;
}

export { rangeRandom, lerp };
