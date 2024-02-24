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
	};

	let items: Item[] = [
		{ id: 1, x: 0, y: 0, height: 50, width: 50, text: "Math" },
		{ id: 2, x: 50, y: 0, height: 50, width: 50, text: "Science" },
		{ id: 3, x: 10, y: 10, height: 50, width: 50, text: "Art" },
		{ id: 4, x: 10, y: 10, height: 50, width: 50, text: "Business" },
		{ id: 5, x: 10, y: 10, height: 50, width: 50, text: "Service" },
		{ id: 6, x: 10, y: 10, height: 50, width: 50, text: "Social Science" },
		{ id: 7, x: 10, y: 10, height: 50, width: 50, text: "Technology" }
	];

	let itemNames: Set<string> = new Set();
	for (const item of items) {
		itemNames.add(item.text);
	}

	function checkForOverlap(
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
			combineItems(curIndex, overlapIndex);
		}
	}

	function combineItems(index1: number, index2: number) {
		let item1 = items[index1];
		let item2 = items[index2];

		item1.x = (item1.x + item2.x) / 2;
		item1.y = (item1.y + item2.y) / 2;
		item1.text = getNewText(item1.text, item2.text);
		itemNames.add(item1.text);
		items.splice(index2, 1);
		itemNames = itemNames;

		items = items;
	}

	function getNewText(text1: string, text2: string) {
		return text1 + " " + text2;
	}
</script>

<div class="w-64 h-full fixed overflow-y-auto bg-gray-800 text-white right-0 p-3">
	<div class="sidebar">
		{#each itemNames as text}
			<ItemSource {text} />
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
		on:drop={(event) => checkForOverlap(item, event.detail.x, event.detail.y, true)}
	/>
{/each}

<style>
    .sidebar {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        overflow-x: auto;
    }
</style>
