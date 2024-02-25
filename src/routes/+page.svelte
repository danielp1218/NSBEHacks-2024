<script lang="ts">
	import Item from "$lib/components/Item.svelte";
	import ItemSource from "$lib/components/ItemSource.svelte";
	import Trash from "$lib/images/trashcan.png";

	let trashCan: HTMLElement;
	let trashCanHover: boolean = false;

	type Item = {
		id: number;
		x: number;
		y: number;
		height: number;
		width: number;
		text: string;
		created?: boolean;
		hover?: boolean;
	};

	let items: Item[] = [
		{ id: 1, x: 200, y: 200, height: 50, width: 50, text: "Math" },
		{ id: 2, x: 400, y: 200, height: 50, width: 50, text: "Science" },
		{ id: 3, x: 600, y: 200, height: 50, width: 50, text: "Art" },
		{ id: 4, x: 800, y: 200, height: 50, width: 50, text: "Business" },
		{ id: 5, x: 200, y: 400, height: 50, width: 50, text: "Service" },
		{ id: 6, x: 400, y: 400, height: 50, width: 50, text: "Social Science" },
		{ id: 7, x: 600, y: 400, height: 50, width: 50, text: "Technology" }
	];

	let itemNames: Set<string> = new Set();
	for (const item of items) {
		itemNames.add(item.text.toLowerCase());
	}

	let prevOverlapIndex: number = -1;

	async function checkForOverlap(
		currentItem: Item,
		currentX: number,
		currentY: number,
		combine: boolean
	) {
		if (trashCan) {
			const trashCanRect = trashCan.getBoundingClientRect();
			if (
				currentX + currentItem.width / 2 > trashCanRect.left &&
				currentX - currentItem.width / 2 < trashCanRect.right &&
				currentY + currentItem.height / 2 > trashCanRect.top &&
				currentY - currentItem.height / 2 < trashCanRect.bottom
			) {
				if (combine) {
					items = items.filter((item) => item.id !== currentItem.id);
					trashCanHover = false;
					return;
				} else {
					trashCanHover = true;
					return;
				}
			} else {
				trashCanHover = false;
			}
		}
		let curIndex = items.findIndex((item) => item.id === currentItem.id);

		if (curIndex >= items.length || curIndex === -1) return;

		const overlapIndex = items.findIndex((item, idx) => {
			if (idx === curIndex) return false; // Skip checking against itself
			// Check if the current div overlaps with div
			const horizontalOverlap =
				currentX < item.x + item.width && currentX + currentItem.width > item.x;
			const verticalOverlap =
				currentY < item.y + item.height && currentY + currentItem.height > item.y;
			return horizontalOverlap && verticalOverlap;
		});

		if (combine && overlapIndex !== -1) {
			console.log(`Item ${curIndex} overlaps with Div ${overlapIndex}`);
			await combineItems(curIndex, overlapIndex);
		}
		if (!combine) {

			for(let i = 0; i < items.length; i++){
				if(i !== overlapIndex){
					items[i].hover = false;
				} else{
					items[i].hover = true;
				}
			}
			if(overlapIndex!==-1){
				items[curIndex].hover = true;
			}
		}
	}

	async function combineItems(index1: number, index2: number) {
		let item1 = items[index1];
		let item2 = items[index2];

		item1.x = (item1.x + item2.x) / 2;
		item1.y = (item1.y + item2.y) / 2;

		items.splice(index2, 1);
		let temp: string = item1.text;
		item1.hover = true;
		item1.text = "Generating...";
		items = items;
		item1.text = await getNewText(temp, item2.text);
		item1.hover = false;
		itemNames.add(item1.text.toLowerCase());
		itemNames = itemNames;
		items = items;
	}

	async function getNewText(text1: string, text2: string) {
		const response = await fetch("/api/merge",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					career1: text1,
					career2: text2
				})
			}
		);

		const data = await response.json();
		console.log(data.result);
		if(!data.result || data.result === "Invalid Input"){
			return text1;
		}
		return data.result;
	}

	function createNewItem(event: MouseEvent, text: string) {
		console.log("Creating new item");
		const newItem = {
			id: Date.now(),
			x: event.clientX,
			y: event.clientY,
			height: 50,
			width: 50,
			text,
			created: true
		};
		items = [...items, newItem];
		itemNames.add(text);
		itemNames = itemNames;
	}

	function clearItems() {
		items = [];
	}

	const validationRegex = /^[a-zA-Z ]+$/;
	let customCareer = "";
	let sidebar: HTMLElement;
	let addError: boolean = false;
	let errorTimeoutId = setTimeout(() => {
		addError = false;
	}, 3000);

	const addCustomCareer = () => {
		if (customCareer.length > 0 && validationRegex.	test(customCareer)) {
			if(itemNames.has(customCareer.toLowerCase())){
				return;
			}
			itemNames.add(customCareer.toLowerCase());
			itemNames = itemNames;
			customCareer = "";
			sidebar.scrollTo(0, sidebar.scrollHeight);
		} else if (customCareer.length > 0) {
			console.log("fewoi");
			addError = true;
			clearTimeout(errorTimeoutId);
			errorTimeoutId = setTimeout(() => {
				addError = false;
			}, 3000);
		}
	};
</script>

<div class="w-64 h-full fixed bg-gray-800 text-white right-0 p-3">
	<div class="sidebar" bind:this={sidebar}>
		{#each itemNames as text}
			<div on:mousedown={(event) => createNewItem(event, text)} class="m-3">
				<ItemSource {text} />
			</div>
		{/each}
	</div>
<div class="fixed bottom-0 right-0 w-64">
		<p class="bg-red-500 text-white pl-2 p-2 opacity-0 transition-opacity" class:add-career-error={addError}>Please enter a valid career</p>
		<div class="flex flex-row">
			<button
				on:click={addCustomCareer}
				class="text-4xl add-button text-center w-96 h-16 justify-center align-middle transition-all add-career-button"
			>
				+
			</button>
			<input bind:value={customCareer} class="p-4 w-48 text-black" placeholder="Add an interest here" width="200px">
		</div>
	</div>
</div>

{#each items as item (item.id)}
	<Item
		text={item.text}
		bind:x={item.x}
		bind:y={item.y}
		bind:height={item.height}
		bind:width={item.width}
		created={item.created}
		hover={item.hover}
		on:drop={async (event) => await checkForOverlap(item, event.detail.x, event.detail.y, true)}
		on:drag={async (event) => await checkForOverlap(item, event.detail.x, event.detail.y, false)}
	/>
{/each}

<div class="trashcan" bind:this={trashCan} class:trashcan-hover={trashCanHover}
	 on:mouseenter={()=>(trashCanHover=true)} on:mouseleave={()=>(trashCanHover=false)}
	 on:click={clearItems}
>
	<img alt="Trashcan" src={Trash} width="128px" />
</div>

<style>
    * {
        font-family: "Kumbh Sans", sans-serif;
    }

    .sidebar {
        display: flow;
        overflow-y: auto;
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
        height: 92%;
    }

    .trashcan {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 70px;
        width: 70px;
        margin: 30px;
        z-index: -100;
        opacity: 0.5;
        transition: 0.2s all ease-in-out;
    }

    .trashcan img {
        height: fit-content;
        width: fit-content;
        cursor: pointer;
    }

    .trashcan-hover {
        opacity: 1;
        transition: 0.2s all ease-in-out;
    }

    .add-button:hover {
        transition: 0.1s all ease-in-out;
        background-color: #4a5568;
    }

    .add-career-button {
        background-color: #C4B0FF;
    }

    .add-career-button:hover {
        background-color: #a285fc;
    }

	.add-career-error {
		opacity: 1;
		transition: 0.2s all ease-in-out;
	}
</style>
