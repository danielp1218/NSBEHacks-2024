<script lang="ts">
	import "../app.css";

	let arr: number[] = [];
	for (let i = 0; i < 25 * 25; i++) {
		arr.push(i);
	}
</script>

<svelte:head>
	<style>
		@import url("https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&display=swap");
	</style>
</svelte:head>

<div class="dot-grid">
	{#each arr as i}
		<div
			style="
				width: 100%;
				height: 100%;
				border: 1px solid #e0e0e0;
				background: #f5f5f5;
				opacity: 0.5;
			"
		></div>
	{/each}
</div>

<slot />

<style lang="postcss">
	:global(body) {
	}

	.dot-grid {
		z-index: -100;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(25, 1fr);
		grid-template-rows: repeat(25, 1fr);
		background: #f5f5f5;
	}
</style>
