import { lerp, rangeRandom } from './utils';

export const N_SNOWFLAKES = 100;
export const SNOWFLAKE_HEIGHT_EM = 12;

const MAX_IN_DELAY = 5000;
export function randomInDelay() {
	return rangeRandom(0, MAX_IN_DELAY);
}

const MIN_IN_DURATION = 2000;
const MAX_IN_DURATION = 10000;
export function randomInDuration() {
	return rangeRandom(MIN_IN_DURATION, MAX_IN_DURATION);
}

const MIN_FONTSIZE = 12;
const MAX_FONTSIZE = 48;
const FONT_SIZE_NOISE_RANGE = 4;
// Font size relative to the "fall duration", to give the impression of "depth"
export function interpolateFontSize(inDuration: number) {
	const t = (inDuration - MIN_IN_DURATION) / (MAX_IN_DURATION - MIN_IN_DURATION);
	const value = lerp(MAX_FONTSIZE, MIN_FONTSIZE, t);
	const fontSize = value + rangeRandom(-FONT_SIZE_NOISE_RANGE, FONT_SIZE_NOISE_RANGE);
	return fontSize;
}

const MIN_OUT_DURATION = 500;
const MAX_OUT_DURATION = 3000;
export function randomOutDuration() {
	return rangeRandom(MIN_OUT_DURATION, MAX_OUT_DURATION);
}
