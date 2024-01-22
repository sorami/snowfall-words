<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';

	import { cubicOut, backIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	/* 
	Based on this awesome example: https://mannes.tech/svelte-snowfall/
	*/

	let SNOW_ICONS = [
		'雪は楽しい',
		'雪かきが大変',
		'寒い',
		'音が吸収されて静か',
		'滑って転ぶ',
		'スキー楽しい',
		'反射して眩しい',
		'車の運転が怖い',
		'自動車のタイヤ交換が必要',
		'観光資源'
	];

	const SNOWFLAKES_COUNT = 500;
	const SNOWFLAKE_MIN_SCALE = 0.4;
	const MAX_FALL_DURATION = 10000;
	const MELTING_WAIT = 3000;
	const MELTING_DURATION = 8000;
	const WIND_FORCE = 0.2;

	const MAX_TOTAL_TIME = MAX_FALL_DURATION + MELTING_WAIT + MELTING_DURATION;

	function randomSnowflakeConfig(i: number) {
		const scale = SNOWFLAKE_MIN_SCALE + Math.random() * (1 - SNOWFLAKE_MIN_SCALE);
		const xStart = Math.random() * (1 + WIND_FORCE) - WIND_FORCE;
		return {
			visible: false,
			scale,
			inDelay: Math.random() * MAX_TOTAL_TIME,
			inDuration: (1 + SNOWFLAKE_MIN_SCALE - scale) * MAX_FALL_DURATION,
			xStart,
			xEnd: xStart + scale * WIND_FORCE,
			snowIcon: SNOW_ICONS[i % SNOW_ICONS.length]
		};
	}

	let snowflakes = new Array(SNOWFLAKES_COUNT)
		.fill()
		.map((_, i) => randomSnowflakeConfig(i))
		.sort((a, b) => a.scale - b.scale);

	// Svelte custom transition
	function fall(
		_node: HTMLElement,
		{ delay = 0, duration = 1000, xStart = 0.1, xEnd = 0.5, scale = 1.0 }
	) {
		return {
			duration,
			delay,
			css: (t: number) => {
				const x_t = backIn(t);
				const y_t = t;

				const x_coord = (xEnd - xStart) * x_t + xStart;
				return `
          transform: scale(${scale}) rotate(${x_t * 720}deg);
          left: ${x_coord * 100}%;
          bottom: ${100 - y_t * 100}%;
        `;
			}
		};
	}

	// start everything on mount. starting means setting the snowflakes visible.
	// this "hack" is not needed when you configure your svelte to display transitions on first render:
	// https://svelte.dev/docs#Client-side_component_API - set `intro: true`
	onMount(async () => {
		setTimeout(() => {
			snowflakes = snowflakes.map((sf) => ({ ...sf, visible: true }));
		}, 50);
	});
</script>

<svelte:head>
	<title>Snowfall Words</title>
</svelte:head>

<div class="snowframe" aria-hidden="true">
	{#each snowflakes as flake}
		{#if flake.visible}
			<div
				class="snowflake"
				style={`transform: scale(${flake.scale}); left: ${flake.xEnd * 100}%`}
				in:fall={{
					delay: flake.inDelay,
					duration: flake.inDuration,
					scale: flake.scale,
					xStart: flake.xStart,
					xEnd: flake.xEnd
				}}
				out:fade={{ delay: MELTING_WAIT, duration: MELTING_DURATION, easing: cubicOut }}
				on:introend={() => (flake.visible = false)}
				on:outroend={() => (flake.visible = true)}
			>
				{flake.snowIcon}
			</div>
		{/if}
	{/each}
</div>

<style>
	:global(body) {
		min-height: 100%;
		@apply bg-gray-900;
	}

	:global(html) {
		height: 100%;
	}

	.snowframe {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
	}

	.snowflake {
		color: #fff;
		font-size: 1.2rem;
		line-height: 1.2rem;
		font-family: Arial, sans-serif;
		text-shadow: 0 0 5px #000;
		position: absolute;
		z-index: 1000;
		overflow: hidden;
	}
</style>
