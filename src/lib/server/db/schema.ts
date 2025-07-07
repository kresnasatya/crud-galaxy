import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey(),
	name: text().notNull(),
	age: integer('age')
});

export const galaxies = sqliteTable('galaxies', {
	id: integer('id').primaryKey(),
	name: text().notNull(),
})
