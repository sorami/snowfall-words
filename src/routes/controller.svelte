<script lang="ts">
	export let isVisible = true;
</script>

<div class="fixed top-3 left-3 z-999">
	{#if isVisible}
		<div id="controller" class="flex flex-col gap-3">
			<h2 class="font-bold">Parameters</h2>
			<div>
				<label for="n-snowflakes">#flakes</label>
				<input type="range" id="n-snowflakes" name="n-snowflakes" min="1" max="100" value="50" />
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
