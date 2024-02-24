<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
	export let x: number = 0;
	export let y: number = 0;
	export let height: number = 50;
	export let width: number = 50;
	export let text: string = "Hello World";

	let moving: boolean = false;

	function handleMouseDown() {
		moving = true;
	}

	function handleMouseMove(e: MouseEvent) {
		if (moving) {
			x += e.movementX;
			y += e.movementY;
			dispatch("drag", { x, y });
		}
	}

	function handleMouseUp() {
		if (moving) {
			dispatch("drop", { x, y });
		}
		moving = false;
	}
</script>

<div
	class="draggable bg-gray-100 border-gray-600 border-4"
	style="left: {x}px; top: {y}px"
	on:mousedown={handleMouseDown}
	class:z-50={moving}
	bind:clientHeight={height}
	bind:clientWidth={width}
>
	<h1>{text}</h1>
</div>

<svelte:window on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} />

<style>
	.draggable {
		user-select: none;
		cursor: move;
		position: absolute;
		pointer-events: auto;
	}
</style>
