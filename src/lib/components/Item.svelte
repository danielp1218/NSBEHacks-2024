<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

	const dispatch = createEventDispatcher();
	export let x: number = 0;
	export let y: number = 0;
	export let height: number = 50;
	export let width: number = 50;
	export let text: string;

	export let created: boolean = false;

	export let hover: boolean = false;
	export let emoji: string = "🙂";

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

	const titleCase = (str: string) => {
		if (!str) return "";
		return str.toLowerCase().split(" ").map(function(word) {
			// Check if the word is 'it', if so, return 'IT'
			if (word === "it") {
				return "IT";
			} else if (word === "ai") {
				return "AI";
			} else if (word === "ux") {
				return "UX";
			} else {
				return word.replace(word[0], word[0].toUpperCase());
			}
		}).join(" ");
	};

	onMount(() => {
		if (created) {
			handleMouseDown();
			created = false;
		}
	});
</script>


<div
	class="draggable career-item"
	style="left: {x}px; top: {y}px"
	on:mousedown={handleMouseDown}
	on:mouseenter={() => (hover = true)}
	on:mouseleave={() => (hover = false)}
	class:z-50={moving}
	bind:clientHeight={height}
	bind:clientWidth={width}
	class:career-item-hover={hover}
>
	<h1 class="career-item-text select-none">{emoji} {titleCase(text)}</h1>
</div>

<svelte:window on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} on:load={()=>(moving=false)} />

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
        padding: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.3s background-color;
        white-space: nowrap;
        transform: translate(-50%, -50%);
    }

    .career-item-hover {
        background: #4942E4;
        transition: 0.3s background-color;
        cursor: grab;
    }

    .career-item-text {
        color: #faf6ed;
        font-family: Kumbh Sans, sans-serif;
    }
</style>
