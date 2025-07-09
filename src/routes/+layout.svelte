<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>CRUD Galaxy</title>
</svelte:head>

<main>
	{@render children()}
</main>
