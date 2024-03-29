<script lang="ts">
	import Item from "$lib/components/Item.svelte";
	import ItemSource from "$lib/components/ItemSource.svelte";
	import Trash from "$lib/images/trashcan.png";
	import Logo from "$lib/images/logo.png";
	import Help from "$lib/images/help.png";
	import { browser } from "$app/environment";

	let trashCan: HTMLElement;
	let trashCanHover: boolean = false;

	let helpIcon: HTMLElement;
	let helpIconHover: boolean = false;
	let helpHoverTimeout = setTimeout(() => {
		helpClicked = false;
	}, 3000);
	let helpClicked: boolean = false;
	$: {
		if (helpClicked) {
			clearTimeout(helpHoverTimeout);
			helpHoverTimeout = setTimeout(() => {
				helpClicked = false;
			}, 5000);
		}
	}

	let modalOpened: boolean = false;

	type Item = {
		id: number;
		x: number;
		y: number;
		height: number;
		width: number;
		text: string;
		created?: boolean;
		hover?: boolean;
		emoji?: string;
	};

	let items: Item[] = [];
	async function getEmoji(career: string) {
		const response = await fetch("/api/emoji", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				career
			})
		});
		const data = await response.json();
		return data.emoji ?? "🙂";
	}

	let itemNameToEmoji: Map<string, string> = new Map();

	function lazyInitSidebar() {
		for (const itemText of [
			"Math",
			"Science",
			"Art",
			"Social Science",
			"Technology",
			"Business"
		]) {
			itemNameToEmoji.set(itemText.toLowerCase(), "🙂");
		}
		itemNameToEmoji = itemNameToEmoji;
	}

	async function initSidebar() {
		for (const itemText of [
			"Math",
			"Science",
			"Art",
			"Social Science",
			"Technology",
			"Business"
		]) {
			itemNameToEmoji.set(itemText.toLowerCase(), await getEmoji(itemText));
			itemNameToEmoji = itemNameToEmoji;
		}
	}
	if (browser) {
		lazyInitSidebar();
		initSidebar();
	}

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

		if (helpIcon) {
			const helpIconRect = helpIcon.getBoundingClientRect();
			if (
				currentX + currentItem.width / 2 > helpIconRect.left &&
				currentX - currentItem.width / 2 < helpIconRect.right &&
				currentY + currentItem.height / 2 > helpIconRect.top &&
				currentY - currentItem.height / 2 < helpIconRect.bottom
			) {
				if (combine) {
					items = items.filter((item) => item.id !== currentItem.id);
					await openModal(currentItem.text, currentItem.emoji);
					helpIconHover = false;
					return;
				} else {
					helpIconHover = true;
					return;
				}
			} else {
				helpIconHover = false;
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
			for (let i = 0; i < items.length; i++) {
				items[i].hover = i === overlapIndex;
			}
			if (overlapIndex !== -1) {
				items[curIndex].hover = true;
			}
		}
	}

	async function combineItems(index1: number, index2: number) {
		let item1 = items[index1];
		let item2 = items[index2];

		item1.x = (item1.x + item2.x) / 2;
		item1.y = (item1.y + item2.y) / 2;

		let temp: string = item1.text;
		const newItem: Item = {
			id: Date.now(),
			x: (item1.x + item2.x) / 2,
			y: (item1.y + item2.y) / 2,
			height: item1.height,
			width: item1.width,
			text: "Generating...",
			created: false
		};

		newItem.hover = true;
		newItem.emoji = "🤔";
		items.splice(index1, 1);
		items.splice(index2, 1);
		items.push(newItem);
		items = items;
		newItem.text = await getNewText(temp, item2.text);
		const emoji = await getEmoji(newItem.text);

		itemNameToEmoji.set(newItem.text.toLowerCase(), emoji);
		itemNameToEmoji = itemNameToEmoji;
		newItem.emoji = emoji;
		newItem.hover = false;
		items = items;
	}

	async function getNewText(text1: string, text2: string) {
		if (text1.includes("...")) return text2;
		if (text2.includes("...")) return text1;
		const response = await fetch("/api/merge", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				career1: text1,
				career2: text2
			})
		});

		const data = await response.json();
		console.log(data.result);
		if (!data.result || data.result === "Invalid Input" || data.result.length >= 50) {
			return text1;
		}
		return data.result;
	}

	async function createNewItem(event: MouseEvent, text: string, emoji: string = "🙂") {
		console.log("Creating new item");

		const newItem = {
			id: Date.now(),
			x: event.clientX,
			y: event.clientY,
			height: 50,
			width: 50,
			text,
			created: true,
			emoji
		};
		items = [...items, newItem];
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

	const addCustomCareer = async () => {
		if (customCareer.length > 0 && validationRegex.test(customCareer)) {
			if (itemNameToEmoji.has(customCareer.toLowerCase())) {
				return;
			}
			itemNameToEmoji.set(customCareer.toLowerCase(), await getEmoji(customCareer));
			itemNameToEmoji = itemNameToEmoji;
			customCareer = "";
			sidebar.scrollTo(0, sidebar.scrollHeight);
		} else if (customCareer.length > 0) {
			addError = true;
			clearTimeout(errorTimeoutId);
			errorTimeoutId = setTimeout(() => {
				addError = false;
			}, 3000);
		}
	};

	let modalDescription: string = "";
	let modalTitle: string = "";
	async function openModal(career: string, emoji: string = "🙂") {
		modalDescription = "";
		modalTitle = career + " " + emoji;
		modalOpened = true;
		const response = await fetch("/api/info", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				career: career
			})
		});
		const reader = response.body!.pipeThrough(new TextDecoderStream()).getReader();
		while (true) {
			const { value, done } = await reader.read();
			console.log("resp", done, value);
			if (done || !modalOpened) break;
			modalDescription += `${value}`;
		}
	}
	const titleCase = (str: string) => {
		if (!str) return "";
		return str
			.toLowerCase()
			.split(" ")
			.map(function (word) {
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
			})
			.join(" ");
	};
</script>

<img
	draggable="false"
	src={Logo}
	alt="Ignite Logo"
	class="w-auto h-20 fixed opacity-80 top-0 left-0 m-5"
/>

<div class="m-1 mr-4 fixed top-2 right-64 block">
	<img
		draggable="false"
		src={Help}
		alt="Help"
		class="w-auto h-20 opacity-50 transition-opacity cursor-pointer"
		bind:this={helpIcon}
		on:mouseover={() => (helpIconHover = true)}
		on:mouseleave={() => (helpIconHover = false)}
		class:help-icon-hover={helpIconHover}
		on:click={() => (helpClicked = true)}
	/>
</div>

<div class="opacity-0 fixed right-80 mr-7 top-9" class:box={helpClicked} class:sb1={helpClicked}>
	Drag a career to me for a detailed description!
</div>
<div
	class="m-0 modal justify-center h-screen w-screen flex border-4 opacity-100 transition-opacity fixed top-0 left-0 z-40"
	class:modal-hidden={!modalOpened}
>
	<div class="bg-white text-black shadow-2xl rounded-3xl modal-content p-12">
		<h1 class="font-bold p-2 text-3xl">{titleCase(modalTitle)}</h1>
		<hr class="my-2 h-0.5 bg-black" />
		<p class="overflow-scroll h-[80%]">
			{#each modalDescription.split(/\n-|~/) as text}
				{#if text.includes(":")}
					<br />
					<p class="font-bold">{text}</p>
				{:else if text.trim().length > 0}
					<p>{"• " + text}</p>
				{/if}
			{/each}
		</p>
		<div
			class="fixed top-4 right-4 font-bold text-2xl cursor-pointer"
			on:click={() => (modalOpened = false)}
		>
			x
		</div>
	</div>
</div>

<div class="w-64 h-full fixed bg-gray-800 text-white right-0 p-3">
	<div class="sidebar" bind:this={sidebar}>
		{#each itemNameToEmoji.entries() as [text, emoji]}
			<div
				on:mousedown={async (event) => await createNewItem(event, text, emoji)}
				class="m-3"
			>
				<ItemSource {text} {emoji} />
			</div>
		{/each}
	</div>
	<div class="fixed bottom-0 right-0 w-64">
		<p
			class="bg-red-500 text-white pl-2 p-2 opacity-0 transition-opacity"
			class:add-career-error={addError}
		>
			Please enter a valid career
		</p>
		<div class="flex flex-row">
			<button
				on:click={addCustomCareer}
				class="text-4xl add-button text-center w-96 h-16 justify-center align-middle transition-all add-career-button cursor-pointer"
			>
				+
			</button>
			<input
				bind:value={customCareer}
				class="p-4 w-48 text-black"
				placeholder="Add an interest here"
				width="200px"
			/>
		</div>
	</div>
</div>

{#each items as item (item.id)}
	<Item
		text={item.text}
		emoji={item.emoji ?? "🙂"}
		bind:x={item.x}
		bind:y={item.y}
		bind:height={item.height}
		bind:width={item.width}
		created={item.created}
		hover={item.hover}
		on:drop={async (event) => await checkForOverlap(item, event.detail.x, event.detail.y, true)}
		on:drag={async (event) =>
			await checkForOverlap(item, event.detail.x, event.detail.y, false)}
	/>
{/each}

<div
	class="trashcan"
	bind:this={trashCan}
	class:trashcan-hover={trashCanHover}
	on:mouseenter={() => (trashCanHover = true)}
	on:mouseleave={() => (trashCanHover = false)}
	on:click={clearItems}
>
	<img draggable="false" alt="Trashcan" src={Trash} width="128px" />
</div>

<style>
	* {
		font-family: "Kumbh Sans", sans-serif;
		user-select: none;
	}

	.sidebar {
		display: flow;
		overflow-y: auto;
		box-sizing: border-box;
		margin-left: auto;
		margin-right: auto;
		height: 95%;
		padding-bottom: 24px;
	}

	.trashcan {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 70px;
		width: 70px;
		margin: 25px 15px 25px 25px;
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
		background-color: #f1b373;
	}

	.add-career-button:hover {
		background-color: #f08e3f;
	}

	.add-career-error {
		opacity: 1;
		transition: 0.2s all ease-in-out;
	}

	.help-icon-hover {
		opacity: 1;
		transition: 0.2s all ease-in-out;
	}
	.box {
		width: 300px;
		background: #f08e3f;
		padding: 20px;
		text-align: center;
		font-weight: 900;
		color: #fff;
		opacity: 1;
		transition: 0.2s opacity ease-in-out;
	}

	.sb1:before {
		content: "";
		width: 0;
		height: 0;
		position: absolute;
		border-left: 10px solid #f08e3f;
		border-right: 10px solid transparent;
		border-top: 10px solid #f08e3f;
		border-bottom: 10px solid transparent;
		right: -19px;
		top: 6px;
		opacity: 1;
		transition: 0.2s opacity ease-in-out;
	}

	.modal {
		background: rgba(0, 0, 0, 0.5);
		opacity: 1;
		transition: 0.2s all ease-in-out;
	}

	.modal-content {
		position: fixed;
		width: 800px;
		height: 500px;
		top: 50%;
		left: 50%;
		margin-right: -50%;
		transform: translate(-50%, -50%);
	}

	.modal-hidden {
		display: none;
		opacity: 0;
		transition: 0.2s all ease-in-out;
	}
</style>
