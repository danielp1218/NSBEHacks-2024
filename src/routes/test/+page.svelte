<script lang="ts">
	let career1 = "";
	let career2 = "";
	let result: string | null = null;
	const merge = async () => {
		const response = await fetch(`/api/merge?career1=${career1}&career2=${career2}`, {
			method: "GET"
		});
		const data = await response.json();
		result = data.result;
	};
</script>

<input bind:value={career1}>
<input bind:value={career2}>
<button on:click={merge}>Submit</button>

<h1>Result: {result ?? "Submit to see the result"}</h1>