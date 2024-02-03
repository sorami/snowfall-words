<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import {
		N_SNOWFLAKES,
		SNOWFLAKE_HEIGHT_EM,
		randomInDelay,
		randomInDuration,
		randomOutDuration,
		interpolateFontSize
	} from '$lib/params';

	import { sentences } from '$lib/data';
	let clauses = sentences.flat();

	// Snowflake data - create all at the beginning
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
		const inDuration = randomInDuration();
		const fontSize = interpolateFontSize(inDuration);
		return {
			visible: false,
			text,
			xCoord,
			inDuration,
			fontSize
		};
	}
	let snowflakes: Snowflake[] = Array.from({ length: N_SNOWFLAKES }, createSnowflake).sort(
		// Sort by "fall duration", so the faster (and bigger) ones are on top
		(a, b) => b.inDuration - a.inDuration
	);

	function inTransition(
		_node: HTMLElement,
		{ xCoord, inDuration, fontSize }: { xCoord: number; inDuration: number; fontSize: number }
	) {
		// Random everytime, so the looped transitions don't look the same
		const delay = randomInDelay();

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

	// TODO: OUT transition

	onMount(async () => {
		// CSS custom properties
		document.documentElement.style.setProperty('--snowflake-height', `${SNOWFLAKE_HEIGHT_EM}em`);

		// start everything on mount. starting means setting the snowflakes visible.
		// this "hack" is not needed when you configure your svelte to display transitions on first render:
		// https://svelte.dev/docs#Client-side_component_API - set `intro: true`
		setTimeout(() => {
			snowflakes = snowflakes.map((sf) => ({ ...sf, visible: true }));
		}, 50);
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
				out:fade={{ delay: 0, duration: randomOutDuration() }}
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

	.snowflake {
		position: absolute;
		z-index: 1000;
		overflow: hidden;
		height: var(--snowflake-height);
		text-align: end;
	}
</style>
