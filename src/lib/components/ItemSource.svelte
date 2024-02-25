<script lang="ts">
	import { browser } from "$app/environment";

	export let text: string;
	const titleCase = (str: string) => {
		if (!str) return "";
		return str
			.toLowerCase()
			.split(/\s+/)
			.map(function (word) {
				// Check if the word is 'it', if so, return 'IT'
				if (word === "it") {
					return "IT";
				} else {
					return word.replace(word[0], word[0].toUpperCase());
				}
			})
			.join(" ");
	};

	text = titleCase(text);
	let emoji = "🙂";
	const loadEmoji = async () => {
		const response = await fetch("/api/emoji", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				career: text
			})
		});

		const data = await response.json();
		emoji = data.emoji ?? "🙂";
	};

	if (browser) {
		loadEmoji();
	}
</script>

<div class="career-item">
	<h1 class="career-item-text select-none">{emoji} {titleCase(text)}</h1>
</div>

<style>
	.career-item {
		background: #8696fe;
		border-radius: 5px;
		padding: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: 0.3s background-color;
	}

	.career-item:hover {
		background: #4942e4;
		transition: 0.3s background-color;
		cursor: grab;
	}

	.career-item-text {
		color: #faf6ed;
		font-family:
			Kumbh Sans,
			sans-serif;
		text-align: center;
	}
</style>
