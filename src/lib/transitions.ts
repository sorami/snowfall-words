import { backInOut } from 'svelte/easing';
import { rangeRandom } from '$lib/utils';

function inTransition(
	_node: HTMLElement,
	{
		xCoord,
		maxDelay,
		inDuration,
		fontSize,
		easingParams
	}: {
		xCoord: number;
		maxDelay: number;
		inDuration: number;
		fontSize: number;
		easingParams: Record<string, number>;
	}
) {
	// Random everytime, so the looped transitions don't look the same
	const delay = rangeRandom(0, maxDelay);

	return {
		delay,
		duration: inDuration,
		css: (t: number) => {
			const xt = backInOut(1 - t) / easingParams.x;
			const deg = (1 - t) * easingParams.deg;

			return `
					left: ${(xCoord + xt) * 100}%;
					font-size: ${fontSize}px;
					bottom: ${100 - t * 100}%;
					transform: rotate(${deg}deg);
		        `;
		}
	};
}

// TODO: OUT transition

export { inTransition };
