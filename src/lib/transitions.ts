import { backInOut } from 'svelte/easing';

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
					${t === 0 ? 'opacity: 0;' : 'opacity: 1;'}
		        `;
		}
	};
}

function outTransition(_node: HTMLElement, { outDuration }: { outDuration: number }) {
	const o = +getComputedStyle(_node).opacity;

	return {
		delay: 0,
		duration: outDuration,
		css: (t: number) => {
			return `
				opacity: ${o * t};
			`;
		}
	};
}

export { inTransition, outTransition };
