<script lang="ts">
	let career1 = "";
	let career2 = "";
	let result: string | null = null;
	const merge = async () => {
		const response = await fetch(`/api/emoji`, {
			method: "POST",
			body: JSON.stringify({ career: career1 })
		});
		const data = await response.json();
		result = data.emoji;
	};
</script>

<input bind:value={career1} />
<input bind:value={career2} />
<button on:click={merge}>Submit</button>

<h1>Result: {result ?? "Submit to see the result"}</h1>
