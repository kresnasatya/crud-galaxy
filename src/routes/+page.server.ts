import { Galaxy } from '$lib/server/galaxies';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const galaxies = await Galaxy().index();

    return { galaxies };
}