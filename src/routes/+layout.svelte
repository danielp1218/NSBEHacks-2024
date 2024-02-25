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

<div class="loading-screen flex flex-col gap-4">
	<h1 class="loading-text">Loading</h1>
	<div class="dot-pulse"></div>
</div>

<div class="dot-grid">
	{#each arr as _}
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

    .loading-screen {
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f5f5f5;
        font-family: "Kumbh Sans", sans-serif;
        font-size: 2rem;
    }

    .dot-pulse {
        position: relative;
        left: -9999px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #000000;
        color: #000000;
        box-shadow: 9999px 0 0 -5px;
        animation: dot-pulse 1.5s infinite linear;
        animation-delay: 0.25s;
    }

    .dot-pulse::before, .dot-pulse::after {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #000000;
        color: #000000;
    }

    .dot-pulse::before {
        box-shadow: 9984px 0 0 -5px;
        animation: dot-pulse-before 1.5s infinite linear;
        animation-delay: 0s;
    }

    .dot-pulse::after {
        box-shadow: 10014px 0 0 -5px;
        animation: dot-pulse-after 1.5s infinite linear;
        animation-delay: 0.5s;
    }

    @keyframes dot-pulse-before {
        0% {
            box-shadow: 9984px 0 0 -5px;
        }
        30% {
            box-shadow: 9984px 0 0 2px;
        }
        60%, 100% {
            box-shadow: 9984px 0 0 -5px;
        }
    }

    @keyframes dot-pulse {
        0% {
            box-shadow: 9999px 0 0 -5px;
        }
        30% {
            box-shadow: 9999px 0 0 2px;
        }
        60%, 100% {
            box-shadow: 9999px 0 0 -5px;
        }
    }

    @keyframes dot-pulse-after {
        0% {
            box-shadow: 10014px 0 0 -5px;
        }
        30% {
            box-shadow: 10014px 0 0 2px;
        }
        60%, 100% {
            box-shadow: 10014px 0 0 -5px;
        }
    }

    h1 {
        font-size: 64px;
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    .loading-screen {
        animation: fadeOut 1s 2s ease-in-out forwards;
    }
</style>
