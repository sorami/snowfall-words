<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';

	import { onMount } from 'svelte';

	import { sentences } from '$lib/data';
	import { fade } from 'svelte/transition';
	let clauses = sentences.flat();

	function rangeRandom(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	function lerp(start: number, end: number, t: number) {
		return start * (1 - t) + end * t;
	}

	////////////////////////////////////////////////////////////
	// PARAMETERS
	const SNOWFLAKE_HEIGHT_EM = 12;

	const MIN_IN_DURATION = 2000;
	const MAX_IN_DURATION = 100000;

	const MIN_OUT_DURATION = 500;
	const MAX_OUT_DURATION = 3000;

	///////////////////////////////////////////////////////////

	// Font size relative to the fall duration, to give the impression of "depth"
	const MIN_FONTSIZE = 12;
	const MAX_FONTSIZE = 48;
	const FONT_SIZE_NOISE_RANGE = 3;
	function interpolateFontSize(inDuration: number) {
		const t = (inDuration - MIN_IN_DURATION) / (MAX_IN_DURATION - MIN_IN_DURATION);
		const value = lerp(MAX_FONTSIZE, MIN_FONTSIZE, t);
		const fontSize = value + rangeRandom(-FONT_SIZE_NOISE_RANGE, FONT_SIZE_NOISE_RANGE);
		return fontSize;
	}

	////////////////////////////////////////////////////////////
	// Snowflake data
	// Create all at the beginning

	type Snowflake = {
		visible: boolean;
		xCoord: number; // [0, 1]
		text: string;
		inDuration: number;
		fontSize: number;
	};

	function createSnowflake(): Snowflake {
		const text = clauses[Math.floor(Math.random() * clauses.length)]; // TODO: to `sentence`
		const xCoord = Math.random();
		const inDuration = rangeRandom(MIN_IN_DURATION, MAX_IN_DURATION);
		const fontSize = interpolateFontSize(inDuration);
		return {
			visible: false,
			text,
			xCoord,
			inDuration,
			fontSize
		};
	}

	// Sort by duration, so the faster (and bigger) ones are on top
	let snowflakes: Snowflake[] = Array.from({ length: 20 }, createSnowflake).sort(
		(a, b) => b.inDuration - a.inDuration
	);

	////////////////////////////////////////////////////////////
	// IN transition

	function inTransition(
		_node: HTMLElement,
		{ xCoord, inDuration, fontSize }: { xCoord: number; inDuration: number; fontSize: number }
	) {
		const delay = 0; // TODO: randomize

		return {
			delay,
			duration: inDuration,
			css: (t: number) => {
				return `
					left: ${xCoord * 100}%;
					bottom: ${100 - t * 100}%;
					font-size: ${fontSize}px;
		        `;
			}
		};
	}

	////////////////////////////////////////////////////////////
	// OUT transition

	onMount(async () => {
		// start everything on mount. starting means setting the snowflakes visible.
		// this "hack" is not needed when you configure your svelte to display transitions on first render:
		// https://svelte.dev/docs#Client-side_component_API - set `intro: true`
		setTimeout(() => {
			snowflakes = snowflakes.map((sf) => ({ ...sf, visible: true }));
		}, 50);

		// CSS custom properties
		document.documentElement.style.setProperty('--snowflake-height', `${SNOWFLAKE_HEIGHT_EM}em`);
	});
</script>

<svelte:head>
	<title>おもいでふりつもる - ななめせんなめせん</title>
</svelte:head>

<div id="snowflake-wrapper">
	{#each snowflakes as sf}
		{#if sf.visible}
			<div
				class="snowflake"
				style="left: {sf.xCoord * 100}%; bottom: 0; font-size: {sf.fontSize}px;"
				in:inTransition={{ xCoord: sf.xCoord, inDuration: sf.inDuration, fontSize: sf.fontSize }}
				on:introend={() => (sf.visible = false)}
				out:fade={{ delay: 0, duration: rangeRandom(MIN_OUT_DURATION, MAX_OUT_DURATION) }}
				on:outroend={() => (sf.visible = true)}
			>
				{sf.text}
			</div>
		{/if}
	{/each}
</div>

<style>
	:global(body) {
		min-height: 100%;
		@apply bg-white;
		@apply text-black;
		writing-mode: vertical-rl;
	}

	:global(html) {
		height: 100%;
	}

	#snowflake-wrapper {
		/* position: relative; */
		height: 100%;
		overflow: hidden;
	}

	.snowflake {
		position: absolute;
		z-index: 1000;
		overflow: hidden;
		height: var(--snowflake-height);
		text-align: end;
	}
</style>
