<script lang="ts">
	import Slider from './Slider.svelte';

	export let isVisible: boolean;
	export let params: any;
</script>

<div class="fixed top-3 left-3 z-999">
	{#if isVisible}
		<div id="controller" class="flex flex-col gap-3">
			<h2 class="text-center font-bold text-sm">パラメーター</h2>

			<div class="flex flex-col gap-3">
				<Slider label="雪片数" bind:value={params.nSnowflakes} min={1} max={100} />

				<Slider label="雪片高" bind:value={params.css.snowflakeHeight.value} min={5} max={30} />

				<div class=" flex flex-col gap-1">
					<h3 class="font-bold text-xs">フォントサイズ</h3>
					<Slider label="min" bind:value={params.font.min} min={10} max={128} />
					<Slider label="max" bind:value={params.font.max} min={10} max={128} />
					<Slider label="ゆらぎ" bind:value={params.font.noise} min={0} max={12} />
				</div>

				<div class=" flex flex-col gap-1">
					<h3 class="font-bold text-xs">水平の動き</h3>
					<Slider label="min" bind:value={params.easing.x.min} min={3} max={30} />
					<Slider label="max" bind:value={params.easing.x.max} min={3} max={30} />
				</div>

				<div class=" flex flex-col gap-1">
					<h3 class="font-bold text-xs">回転の動き</h3>
					<Slider label="deg" bind:value={params.easing.deg} min={0} max={90} />
				</div>

				<div class=" flex flex-col gap-1">
					<h3 class="font-bold text-xs">降る時間</h3>
					<Slider label="min" bind:value={params.in.minDuration} min={500} max={50000} />
					<Slider label="max" bind:value={params.in.maxDuration} min={500} max={50000} />
				</div>

				<div class=" flex flex-col gap-1">
					<h3 class="font-bold text-xs">溶ける時間</h3>
					<Slider label="min" bind:value={params.out.minDuration} min={500} max={10000} />
					<Slider label="max" bind:value={params.out.maxDuration} min={500} max={10000} />
				</div>
			</div>

			<div class="flex justify-end">
				<button
					class="i-material-symbols-cancel hover:opacity-75 w-5 h-5"
					on:click={() => (isVisible = false)}
				/>
			</div>
		</div>
	{:else}
		<button
			class="i-material-symbols-settings w-6 h-6 opacity-75 hover:text-amber-600 transition-colors duration-300 ease-in-out"
			on:click={() => (isVisible = true)}
		/>
	{/if}
</div>

<style>
	#controller {
		@apply p-3 rounded;
		@apply bg-gray-900/80 text-white;
	}
</style>
