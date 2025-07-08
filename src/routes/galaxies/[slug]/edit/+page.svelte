<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";

    // Get data from load function
    let { data } = $props();

    let name = $state(data.galaxy.name || '');
    let error = $state('');
    let loading = $state(false);

    // Get galaxy id from URL params
    const galaxyId = $derived(page.params.slug);

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();

        if (!name.trim()) {
            error = 'Galaxy name is required';
            return;
        }

        loading = true;
        error = '';

        try {
            const response = await fetch(`/api/galaxies/${galaxyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: Number(galaxyId),
                    name: name.trim()
                })
            })

            const result = await response.json();

            if (!response.ok) {
                error = result.error || 'Failed to update galaxy';
                return;
            }

            // Success - redirect to homepage
            goto('/');
        } catch (error) {
            error = 'Network error occurred';
            console.error('Error updating galaxy: ', error)
        } finally {
            loading = false;
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure to delete this galaxy?')) {
            return;
        }

        loading = true;
        error = '';

        try {
            const response = await fetch(`/api/galaxies/${galaxyId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const result = await response.json();
                error = result.error || 'Failed to delete galaxy';
                return;
            }

            // success - redirect to homepage
            goto('/');
        } catch (error) {
            error = 'Network error occured';
            console.error('Error deleting galaxy: ', error);
        } finally {
            loading = false;
        }
    }
</script>

<h1>Edit Galaxy</h1>

<div>
    <form onsubmit={handleSubmit}>
        <input type="text" bind:value={name} placeholder="Galaxy name..." disabled={loading}>
        <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onclick={handleDelete} disabled={loading} style="background-color: #dc2626; color: white;" class="p-2">
                {loading ? 'Deleting...' : 'Delete' }
            </button>
            <button type="button" onclick={() => goto('/')} disabled={loading}>Cancel</button>
        </div>

        {#if error}
            <div class="error" style="color: red; margin-top: 8px">
                {error}
            </div>
        {/if}
    </form>
</div>