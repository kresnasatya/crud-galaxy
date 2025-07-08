import { drizzle } from 'drizzle-orm/better-sqlite3';
import { galaxiesTable } from './db/schema';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import type { Galaxy as GalaxyInterface } from '$lib/types/galaxy';

interface ValidationError {
    error: string
}

export type { ValidationError }

const sqlite = new Database(process.env.DATABASE_URL || 'local.db');
const db = drizzle(sqlite);

export const Galaxy = () => {
    const api = {
        index: async (): Promise<GalaxyInterface[]> => {
            const galaxies = await db.select().from(galaxiesTable);
            return galaxies;
        },
        show: async (id: number): Promise<GalaxyInterface | null> => {
            const galaxies = await db.select().from(galaxiesTable).where(eq(galaxiesTable.id, id));
            return galaxies[0] || null;
        },
        insert: async (record: Omit<GalaxyInterface, 'id'>): Promise<GalaxyInterface | ValidationError> => {
            if (!record.name || record.name.trim() === '') {
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
        destroy: async (id: number): Promise<boolean> => {
            const result = await db
                .delete(galaxiesTable)
                .where(eq(galaxiesTable.id, id))
                .returning();

            return result.length > 0;
        }
    }

    return api;
}