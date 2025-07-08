import { Galaxy } from '$lib/server/galaxies.js';
import { json } from '@sveltejs/kit';

export async function GET({params}) {
    const id = params.slug;

    let galaxy = await Galaxy().show(Number(id));

    if (!galaxy) {
        throw new Error('Not found');
    }
    
    return json(galaxy);
}

export async function PUT({request}) {
    const data = await request.json()

    const result = await Galaxy().update({
        id: data.id,
        name: data.name
    })

    if ('error' in result) {
        return json({ error: result.error }, { status: 400 });
    }

    return json({ status: 201 });
}

export async function DELETE({params}) {
    try {
        // Validate the parameter
        const id = Number(params.slug);
        if (isNaN(id)) {
            return json({ error: 'Invalid galaxy ID' }, { status: 400 });
        }

        // Attempt to delete the galaxy
        const wasDeleted = await Galaxy().destroy(id);

        // Check if the deletion was successful
        if (!wasDeleted) {
            return json({ error: 'Galaxy not found' }, { status: 404 });
        }

        // Return success responses with 204 No Content status
        return new Response(null, { status: 204 });
    } catch (error) {
        // Handle unexpected errors
        console.error('Error deleting galaxy: ', error);
        return json({ error: 'Failed to delete galaxy' }, { status: 500 });
    }
}