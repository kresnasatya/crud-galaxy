import { Galaxy } from '$lib/server/galaxies';
import { json } from '@sveltejs/kit';

export async function POST({request}) {
    const data = await request.json();

    try {
        const result = await Galaxy().store({
            name: data.name
        });

        if ('error' in result) {
            return json({
                error: result.error,
                name: data.name
            }, { status: 400 });
        }

        return json({ status: 200 });
    } catch (error) {
        return json({
            error: 'Database error occured',
            name: data.name
        }, { status: 500 });
    }
}