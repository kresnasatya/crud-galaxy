<script lang="ts">
    import { goto } from '$app/navigation';
    let name = $state('');
    let error = $state('');
    let loading = $state(false);

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        
        if (!name.trim()) {
            error = 'Galaxy name is required';
            return;
        }

        loading = true;
        error = '';

        try {
            const response = await fetch('/api/galaxies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name.trim() })
            });

            const result = await response.json();

            if (!response.ok) {
                error = result.error || 'Failed to create galaxy';
                return;
            }

            // Success - redirect to reset form
            name = '';
            goto('/');
        } catch (error) {
            error = 'Network error occured';
            console.error('Error creating galaxy', error);
        } finally {
            loading = false;
        }
    }
</script>

<h1>Create Galaxy</h1>
<div>
    <form onsubmit={handleSubmit}>
        <input type="text" bind:value={name} placeholder="Galaxy name..." required>
        <button type="submit" disabled={loading} class="cursor-pointer">
            {loading ? 'Saving...' : 'Save'}
        </button>

        {#if error}
            <div class="error" style="color: red; margin-top: 8px">
                {error}
            </div>
        {/if}
    </form>
</div>