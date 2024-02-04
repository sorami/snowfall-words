<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'virtual:uno.css';

	import { onMount } from 'svelte';
	import { lerp, rangeRandom } from '$lib/utils';
	import { inTransition, outTransition } from '$lib/transitions';
	import Controller from './Controller.svelte';
	import { sentences } from '$lib/data';

	let isControllerVisible = true;

	let params = {
		nSentences: 50,
		inDelayClauseInterval: {
			min: 1500,
			max: 3000
		},
		in: {
			minDuration: 5000,
			maxDuration: 20000,
			inDelayOffsetMax: 120000
		},
		out: {
			minDuration: 2000,
			maxDuration: 6000,
			minOutroendDelay: 60000,
			maxOutroendDelay: 120000
		},
		font: {
			min: 9,
			max: 40,
			noise: 0
		},
		css: {
			snowflakeHeight: {
				name: '--snowflake-height',
				value: 8,
				unit: 'em'
			}
		},
		easing: {
			x: {
				min: 10,
				max: 50
			},
			deg: 30
		}
	};

	type Snowflake = {
		visible: boolean;
		xCoord: number; // [0, 1]
		text: string;
		inDelay: number;
		inDuration: number;
		outroendDelay: number;
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

	// Create a snowflake with settings
	function createSentenceSnowflake(sent: string[]): Snowflake[] {
		// same parameters for all clauses
		const xCoord = Math.random();
		const inDuration = rangeRandom(params.in.minDuration, params.in.maxDuration);
		const outroendDelay = rangeRandom(params.out.minOutroendDelay, params.out.maxOutroendDelay);
		const fontSize = interpolateFontSize(inDuration);
		const easingParams = {
			x:
				Math.random() > 0.5
					? rangeRandom(params.easing.x.min, params.easing.x.max)
					: rangeRandom(-params.easing.x.max, -params.easing.x.min),
			deg: rangeRandom(-params.easing.deg, params.easing.deg)
		};

		// adjust interval according to font size
		let tFontSize = (fontSize - params.font.min) / (params.font.max - params.font.min);
		let inDelayClauseInterval = lerp(
			params.inDelayClauseInterval.min,
			params.inDelayClauseInterval.max,
			tFontSize
		);
		const inDelayOffset = rangeRandom(0, params.in.inDelayOffsetMax);

		const sentSnowflakes = sent.map((text, i) => ({
			visible: false,
			inDelay: inDelayOffset + i * inDelayClauseInterval, // each clause falls after interval
			text,
			xCoord,
			inDuration,
			outroendDelay,
			fontSize,
			easingParams
		}));
		return sentSnowflakes;
	}

	let snowflakes: Snowflake[] = [];
	function initSnowflakes() {
		const shuffledSentences = sentences.sort(() => Math.random() - 0.5);
		let randomSentences = [...shuffledSentences];
		while (randomSentences.length < params.nSentences) {
			randomSentences = [...randomSentences, ...shuffledSentences];
		}
		randomSentences = randomSentences.slice(0, params.nSentences);

		snowflakes = randomSentences
			.map(createSentenceSnowflake)
			.flat()
			.sort(
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
					inDelay: sf.inDelay,
					inDuration: sf.inDuration,
					fontSize: sf.fontSize,
					easingParams: sf.easingParams
				}}
				on:introend={() => (sf.visible = false)}
				out:outTransition={{
					outDuration: rangeRandom(params.out.minDuration, params.out.maxDuration)
				}}
				on:outroend={() => {
					// pause for a while before reappearing
					setTimeout(() => {
						sf.visible = true;
					}, sf.outroendDelay);
				}}
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
		text-shadow:
			3px 3px 0 #fff,
			-3px 3px 0 #fff,
			-3px -3px 0 #fff,
			3px -3px 0 #fff;
		@apply font-bold;
		@apply font-sans;
	}
</style>
