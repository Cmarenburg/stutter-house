import { sqliteTable, text, numeric, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const rolePermission = sqliteTable('role_permission', {
	roleId: text('roleId')
		.notNull()
		.references(() => role.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	permissionId: text('permissionId')
		.notNull()
		.references(() => permission.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
})

export const role = sqliteTable('role', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	createdAt: numeric('createdAt')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	updatedAt: numeric('updatedAt').notNull(),
})

export const permission = sqliteTable('permission', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull(),
	createdAt: numeric('createdAt')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	updatedAt: numeric('updatedAt').notNull(),
})

export const password = sqliteTable('password', {
	hash: text('hash').notNull(),
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
})

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey().notNull(),
	createdAt: numeric('createdAt')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	type: text('type').notNull(),
	target: text('target').notNull(),
	secret: text('secret').notNull(),
	algorithm: text('algorithm').notNull(),
	digits: integer('digits').notNull(),
	period: integer('period').notNull(),
	expiresAt: numeric('expiresAt'),
})

export const session = sqliteTable('session', {
	id: text('id').primaryKey().notNull(),
	createdAt: numeric('createdAt')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	expirationDate: numeric('expirationDate').notNull(),
})

export const user = sqliteTable('user', {
	id: text('id').primaryKey().notNull(),
	email: text('email').notNull(),
	username: text('username').notNull(),
	name: text('name'),
	createdAt: numeric('createdAt')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull(),
	updatedAt: numeric('updatedAt').notNull(),
})

export const userRole = sqliteTable('user_role', {
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	roleId: text('roleId')
		.notNull()
		.references(() => role.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
})
