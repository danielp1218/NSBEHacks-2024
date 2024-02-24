<script lang="ts">
	import Item from "$lib/components/Item.svelte";
	import ItemSource from "$lib/components/ItemSource.svelte";

	type Item = {
		id: number;
		x: number;
		y: number;
		height: number;
		width: number;
		text: string;
		created?: boolean;
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

	async function checkForOverlap(
		currentItem: Item,
		currentX: number,
		currentY: number,
		combine: boolean
	) {
		let curIndex = items.findIndex((item) => item.id === currentItem.id);
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
	}

	async function combineItems(index1: number, index2: number) {
		let item1 = items[index1];
		let item2 = items[index2];

		item1.x = (item1.x + item2.x) / 2;
		item1.y = (item1.y + item2.y) / 2;

		items.splice(index2, 1);
		let temp:string= item1.text;
		item1.text = "Generating...";
		items = items;
		item1.text = await getNewText(temp, item2.text);
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
</script>

<div class="w-64 h-full fixed bg-gray-800 text-white right-0 p-3">
	<div class="sidebar">
		{#each itemNames as text}
			<div on:mousedown={(event) => createNewItem(event, text)} class="m-3">
				<ItemSource {text} />
			</div>
		{/each}
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
		on:drop={async (event) => await checkForOverlap(item, event.detail.x, event.detail.y, true)}
	/>
{/each}

<style>
    .sidebar {
        display: flow;
        overflow-y: auto;
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
        height: 100%;
    }
</style>
