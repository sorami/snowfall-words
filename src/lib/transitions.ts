import { backInOut } from 'svelte/easing';
import { rangeRandom } from '$lib/utils';

function inTransition(
	_node: HTMLElement,
	{
		xCoord,
		inDelay,
		inDuration,
		fontSize,
		easingParams
	}: {
		xCoord: number;
		inDelay: number;
		inDuration: number;
		fontSize: number;
		easingParams: Record<string, number>;
	}
) {
	return {
		delay: inDelay,
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
