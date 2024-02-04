<script lang="ts">
	export let label: string;
	export let value: number;
	export let min: number;
	export let max: number;
</script>

<div class="text-xs flex gap-3">
	<input type="range" id={label} name={label} bind:value {min} {max} />
	<label for="n-snowflakes">{label}</label>
</div>
