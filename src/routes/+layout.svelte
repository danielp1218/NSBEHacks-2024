<script>
	import "../app.css";
</script>

<svelte:head>
	<style>
		@import url("https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&display=swap");
	</style>
</svelte:head>

<slot />

<style lang="postcss">
	:global(body) {
		background: #faf6ed;
	}
</style>
