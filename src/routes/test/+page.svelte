<script lang="ts">
	let career1 = "";
	let career2 = "";
	let result: string | null = null;

	const timeout = (ms: number) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				reject(new Error("Request timed out"));
			}, ms);
		});
	};

	const fetchWithTimeout = async (url: URL | RequestInfo, options: RequestInit | undefined, timeoutInMs: number): Promise<Response> => {
		return Promise.race([
			fetch(url, options),
			await timeout(timeoutInMs) as Promise<Response>
		]);
	};

	const merge = async () => {
		const response = await fetchWithTimeout(`/api/info`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ career: career1 })
		}, 500000);
		const data = await response.json();
		result = data.info;
	};
</script>

<input bind:value={career1} />
<input bind:value={career2} />
<button on:click={merge}>Submit</button>

<h1>Result: {result ?? "Submit to see the result"}</h1>
