import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

import { migrate } from 'drizzle-orm/libsql/migrator'

if (!process.env.DATABASE_URL) {
	throw new Error('Missing environment variable: DATABASE_URL')
}

// if (!process.env.DATABASE_AUTH_TOKEN) {
//     throw new Error(
//       "Missing environment variable: DATABASE_AUTH_TOKEN",
//     )
//   }

const client = createClient({
	url: process.env.DATABASE_URL,
	authToken: process.env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle(client)

// export const db = drizzle(
//   new Database(process.env.DATABASE_PATH),
// )
// Automatically run migrations on startup
void migrate(db, {
	migrationsFolder: 'app/drizzle/migrations',
})
