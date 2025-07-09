<script lang="ts">
    import { goto } from '$app/navigation';
    import * as v from 'valibot';

    let name = $state('');
    let error = $state('');
    let loading = $state(false);

    const GalaxySchema = v.object({
        name: v.pipe(
            v.string('Galaxy name must be a string'),
            v.nonEmpty('Galaxy name is required'),
            v.minLength(3, 'Galaxy name must be at least 3 characters'),
            v.maxLength(50, 'Galaxy name must not exceed 50 characters'),
            v.regex(/^[a-zA-Z0-9\s-_]+$/, 'Galaxy name contains invalid characters')
        )
    });

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();

        // Validate the form data using valibot
        const formData = { name: name.trim() };

        try {
            // Parse and validate the data
            const validatedData = v.parse(GalaxySchema, formData);

            // Clear any previous errors
            error = '';
            loading = true;

            const response = await fetch('/api/galaxies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(validatedData)
            });

            const result = await response.json();

            if (!response.ok) {
                error = result.error || 'Failed to create galaxy';
                return;
            }

            // Success - redirect to reset form
            name = '';
            goto('/');
        } catch (validationError) {
            // Handle valibot validation errors
            if (validationError instanceof v.ValiError) {
                // Get the first error message
                const firstIssue = validationError.issues[0];
                error = firstIssue.message;
            } else {
                // Handle network or other errors
                error = 'Network error occured';
                console.error('Error creating galaxy', validationError);
            }
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