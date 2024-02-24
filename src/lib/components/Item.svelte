<script lang="ts">
    import {browser} from "$app/environment";
    import {createEventDispatcher, onMount} from "svelte";

    const dispatch = createEventDispatcher();
    export let x: number = 0;
    export let y: number = 0;
    export let height: number = 50;
    export let width: number = 50;
    export let text: string;

    if (browser) {
        x = Math.max(0, Math.min(x - width / 2, window.innerWidth - width));
        y = Math.max(0, Math.min(y - height / 2, window.innerHeight - height));
    }

    let moving: boolean = false;

    function handleMouseDown() {
        moving = true;
    }

    function handleMouseMove(e: MouseEvent) {
        if (moving) {
            x += e.movementX;
            y += e.movementY;
            dispatch("drag", {x, y});
        }
    }

    function handleMouseUp() {
        if (moving) {
            dispatch("drop", {x, y});
        }
        moving = false;
    }

    const titleCase = (str: string) => {
        return str.toLowerCase().split(' ').map(function (word) {
            return word.replace(word[0], word[0].toUpperCase());
        }).join(' ');
    };

    function init(el: HTMLDivElement) {
        console.log(el.className);
        if (!el.className.startsWith("draggable career-item")) return;
        el.focus();
        handleMouseDown();
    }


</script>


<div
        class="draggable career-item"
        style="left: {x}px; top: {y}px"
        on:mousedown={handleMouseDown}
        class:z-50={moving}
        bind:clientHeight={height}
        bind:clientWidth={width}
        use:init
>
    <h1 class="career-item-text select-none">{titleCase(text)}</h1>
</div>

<svelte:window on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} on:load={()=>(moving=false)}/>

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
