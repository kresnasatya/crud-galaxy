<script lang="ts">
    import { goto } from '$app/navigation';
    import type { GalaxyInterface } from '$lib/server/galaxies';

    let { data } = $props();

    let searchTerm = $state('');
    let filteredResults: GalaxyInterface[] = $state([]);
    $effect(() => {
        if (searchTerm.trim() !== '') {
            filteredResults = data.galaxies.filter((galaxy: GalaxyInterface) => galaxy.name.toLowerCase().includes(searchTerm.toLowerCase()));
        } else {
            filteredResults = data.galaxies;
        }
    })
</script>

{#snippet button(text: string, onclick: any)}
    <button type="button" {onclick} class="cursor-pointer h-9 px-2 rounded-md bg-slate-500 text-white font-bold hover:brightness-90">{text}</button>
{/snippet}
<h1 class="text-2xl">Galaxies</h1>
<div class="mb-4">
    <input type="text" bind:value={searchTerm} placeholder="Search..." class="border border-zinc-400 rounded-md h-9 p-2">
    {@render button('Search', () => {})}
    <a href="/galaxies/create" class="h-9 p-2 rounded-md bg-slate-500 text-white font-bold hover:brightness-90">Add</a>
</div>
<!-- List of galaxies -->
{#each filteredResults as galaxy}
    <div class="flex odd:bg-zinc-200 items-center gap-3 p-2">
        {@render button('Edit', () => { goto(`/galaxies/${galaxy.id}/edit`) })}
        {galaxy.name}
    </div>
{/each}