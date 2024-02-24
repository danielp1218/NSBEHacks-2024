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
	class="draggable career-item"
	style="left: {x}px; top: {y}px"
	on:mousedown={handleMouseDown}
	class:z-50={moving}
	bind:clientHeight={height}
	bind:clientWidth={width}
>
	<h1 class="career-item-text">{text}</h1>
</div>

<svelte:window on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} />

<style>
	.draggable {
		user-select: none;
		cursor: move;
		position: absolute;
		pointer-events: auto;
	}
	.career-item {
		background: #8696FE;
		border-radius: 5px;
		padding: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: 0.3s background-color;
	}

	.career-item:hover {
		background: #4942E4;
		transition: 0.3s background-color;
		cursor: grab;
	}

	.career-item-text {
		color: #faf6ed;
		font-family: Kumbh Sans, sans-serif;
	}
</style>
