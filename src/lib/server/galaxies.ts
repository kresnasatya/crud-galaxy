import { drizzle } from 'drizzle-orm/better-sqlite3'
import { galaxiesTable, usersTable } from './db/schema';
import { eq } from 'drizzle-orm';

interface GalaxyInterface {
    id: number,
    name: string
};

interface ValidationError {
    error: string
}

export type { GalaxyInterface, ValidationError }

const db = drizzle(process.env.DB_URL!);

export const Galaxy = () => {
    const api = {
        index: async (): Promise<GalaxyInterface[]> => {
            const galaxies = await db.select().from(galaxiesTable);
            return galaxies;
        },
        show: async (id: number): Promise<GalaxyInterface> => {
            const galaxies = await db.select().from(galaxiesTable).where(eq(galaxiesTable.id, id));
            return galaxies[0];
        },
        insert: async (record: GalaxyInterface): Promise<GalaxyInterface | ValidationError> => {
            if (record.name.trim() === '') {
                return {error: 'Please provide a galaxy name'}
            }
            const response = await db.insert(galaxiesTable).values({
                name: record.name
            }).returning();

            if (response.length === 0) {
                throw new Error('Unable to insert record');
            }

            return response[0];
        },
        update: async (record: GalaxyInterface): Promise<GalaxyInterface | ValidationError> => {
            if (record.name.trim() === '') {
                return { error: 'Please provide a galaxy name' };
            }

            const results = await db
                .update(galaxiesTable)
                .set({ name: record.name })
                .where(eq(galaxiesTable.id, record.id))
                .returning();
            
            if (results.length === 0) {
                throw new Error('Unable to update record.');
            }

            return results[0];
        },
        destroy: async (id: number): Promise<void> => {
            await db
                .delete(galaxiesTable)
                .where(eq(galaxiesTable.id, id));
        }
    }

    return api;
}