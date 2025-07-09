import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
    const id = params.id;

    if (isNaN(Number(id))) {
        throw error(400, 'Invalid galaxy ID');
    }

    try {
        const response = await fetch(`/api/galaxies/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw error(404, 'Galaxy not found');
            }
            throw error(response.status, 'Failed to load galaxy');
        }

        const galaxy = await response.json();

        return {
            galaxy
        };
    } catch (error: any) {
        if (error.status) {
            throw error;
        }

        console.error('Error loading galaxy: ', error);
        throw error(500, 'Failed to load galaxy');
    }
}