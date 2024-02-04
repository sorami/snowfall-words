<script lang="ts">
	export let isVisible: boolean;
	export let params: any;
</script>

<div class="fixed top-3 left-3 z-999">
	{#if isVisible}
		<div id="controller" class="flex flex-col gap-3">
			<h2 class="font-bold">Parameters</h2>
			<div class="text-xs">
				<div class="flex gap-3">
					<label for="n-snowflakes">雪片数</label>
					<input
						type="range"
						id="n-snowflakes"
						name="n-snowflakes"
						bind:value={params.nSnowflakes}
						min="1"
						max="100"
					/>
					<div class="w-4">
						{params.nSnowflakes}
					</div>
				</div>
			</div>

			<div class="text-xs">
				<div class="flex gap-3">
					<label for="snowflake-height">雪片高さ</label>
					<input
						type="range"
						id="snowflake-height"
						name="snowflake-height"
						bind:value={params.css.snowflakeHeight.value}
						min="5"
						max="20"
					/>
					<div class="w-4">
						{params.css.snowflakeHeight.value}
					</div>
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
