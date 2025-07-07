import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
	id: integer('id').primaryKey(),
	name: text().notNull(),
	age: integer('age')
});

export const galaxiesTable = sqliteTable('galaxies', {
	id: integer('id').primaryKey(),
	name: text().notNull(),
})
