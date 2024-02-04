<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { lerp, rangeRandom } from '$lib/utils';
	import { inTransition } from '$lib/transitions';
	import Controller from './controller.svelte';

	let isControllerVisible = true;

	import { sentences } from '$lib/data';
	let clauses = sentences.flat();

	let params = {
		nSnowflakes: 20,
		in: {
			maxDelay: 5000,
			minDuration: 5000,
			maxDuration: 20000
		},
		out: {
			minDuration: 500,
			maxDuration: 3000
		},
		font: {
			min: 9,
			max: 36,
			noise: 3
		},
		css: {
			snowflakeHeight: {
				name: '--snowflake-height',
				value: 12,
				unit: 'em'
			}
		}
	};

	type Snowflake = {
		visible: boolean;
		xCoord: number; // [0, 1]
		text: string;
		inDuration: number;
		fontSize: number;
		easingParams: Record<string, number>;
	};

	// Font size relative to the "fall duration", to give the impression of "depth"
	function interpolateFontSize(inDuration: number) {
		const t =
			(inDuration - params.in.minDuration) / (params.in.maxDuration - params.in.minDuration);
		const value = lerp(params.font.max, params.font.min, t);
		const fontSize = value + rangeRandom(-params.font.noise, params.font.noise);
		return fontSize;
	}

	function createSnowflake(): Snowflake {
		const text = clauses[Math.floor(Math.random() * clauses.length)]; // TODO: use `sentence`
		const xCoord = Math.random();
		const inDuration = rangeRandom(params.in.minDuration, params.in.maxDuration);
		const fontSize = interpolateFontSize(inDuration);

		// TODO: to `params.ts`
		const easingParams = {
			x: Math.random() > 0.5 ? rangeRandom(10, 30) : rangeRandom(-30, -10),
			deg: rangeRandom(-20, 20)
		};
		return {
			visible: false,
			text,
			xCoord,
			inDuration,
			fontSize,
			easingParams
		};
	}

	let snowflakes: Snowflake[] = [];
	function initSnowflakes() {
		snowflakes = Array.from({ length: params.nSnowflakes }, createSnowflake).sort(
			// Sort by "fall duration", so the faster (and bigger) ones are on top
			(a, b) => b.inDuration - a.inDuration
		);

		// start everything on mount. starting means setting the snowflakes visible.
		// this "hack" is not needed when you configure your svelte to display transitions on first render:
		// https://svelte.dev/docs#Client-side_component_API - set `intro: true`
		setTimeout(() => {
			snowflakes = snowflakes.map((sf) => ({ ...sf, visible: true }));
		}, 50);
	}

	function updateCustomCssProperties() {
		if (!mounted) return;
		for (const item of Object.values(params.css)) {
			document.documentElement.style.setProperty(item.name, `${item.value}${item.unit}`);
		}
	}

	// Update when params change
	$: {
		params;
		updateCustomCssProperties();
		initSnowflakes();
	}

	let mounted = false;
	onMount(async () => {
		updateCustomCssProperties();
		initSnowflakes();
		mounted = true;
	});
</script>

<svelte:head>
	<title>おもいでふりつもる - ななめせんなめせん</title>
</svelte:head>

<Controller bind:isVisible={isControllerVisible} bind:params />

<div id="snowflake-wrapper">
	{#each snowflakes as sf}
		{#if sf.visible}
			<div
				class="snowflake"
				style="left: {sf.xCoord * 100}%; bottom: 0; font-size: {sf.fontSize}px;"
				in:inTransition={{
					xCoord: sf.xCoord,
					maxDelay: params.in.maxDelay,
					inDuration: sf.inDuration,
					fontSize: sf.fontSize,
					easingParams: sf.easingParams
				}}
				on:introend={() => (sf.visible = false)}
				out:fade={{
					delay: 0,
					duration: rangeRandom(params.out.minDuration, params.out.maxDuration)
				}}
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
	}

	:global(html) {
		height: 100%;
	}

	.snowflake {
		position: absolute;
		z-index: 100;
		overflow: hidden;
		height: var(--snowflake-height);
		writing-mode: vertical-rl;
		text-align: end;
		line-height: 1.1em;
		@apply font-sans;
	}
</style>
