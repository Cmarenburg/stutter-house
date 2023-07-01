import { type Password, type User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import invariant from 'tiny-invariant'
// import { prisma } from '~/utils/db.server.ts'
import { db } from '~/drizzle/config.server.ts'
import { user, session, password as pass } from '~/drizzle/schema.server.ts'

import { sessionStorage } from './session.server.ts'
import { redirect } from '@remix-run/node'
import { createId } from '@paralleldrive/cuid2'
// import { password } from 'drizzle/schema.ts'
import { eq } from 'drizzle-orm'

export type { User }

export const authenticator = new Authenticator<string>(sessionStorage, {
	sessionKey: 'sessionId',
})

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30

authenticator.use(
	new FormStrategy(async ({ form }) => {
		const username = form.get('username')
		const password = form.get('password')

		invariant(typeof username === 'string', 'username must be a string')
		invariant(username.length > 0, 'username must not be empty')

		invariant(typeof password === 'string', 'password must be a string')
		invariant(password.length > 0, 'password must not be empty')

		const user = await verifyLogin(username, password)
		if (!user) {
			throw new Error('Invalid username or password')
		}
		// const session = await prisma.session.create({

		const ssn = await db
			.insert(session)
			.values({
				id: createId(),
				userId: user.id as string,
				expirationDate: new Date(
					Date.now() + SESSION_EXPIRATION_TIME,
				).toISOString(),
				createdAt: new Date().toISOString(),
			})
			.returning()
			.run()

		console.log(ssn)

		return ssn.rows[0].id as string
	}),
	FormStrategy.name,
)

export async function requireUserId(
	request: Request,
	{ redirectTo }: { redirectTo?: string | null } = {},
) {
	const requestUrl = new URL(request.url)
	redirectTo =
		redirectTo === null
			? null
			: redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`
	const loginParams = redirectTo
		? new URLSearchParams([['redirectTo', redirectTo]])
		: null
	const failureRedirect = ['/login', loginParams?.toString()]
		.filter(Boolean)
		.join('?')
	const sessionId = await authenticator.isAuthenticated(request, {
		failureRedirect,
	})
	// const session = await prisma.session.findFirst({
	// 	where: { id: sessionId },
	// 	select: { userId: true, expirationDate: true },
	// })

	const ssn = (
		await db.select().from(session).where(eq(session.id, sessionId)).run()
	).rows[0]

	if (!ssn) {
		throw redirect(failureRedirect)
	}
	return session.userId
}

export async function getUserId(request: Request) {
	const sessionId = await authenticator.isAuthenticated(request)
	if (!sessionId) return null
	// const session = await prisma.session.findUnique({
	// 	where: { id: sessionId },
	// 	select: { userId: true },
	// })
	const ssn = (
		await db.select().from(session).where(eq(session.id, sessionId)).run()
	).rows[0]
	if (!ssn) {
		// Perhaps their session was deleted?
		await authenticator.logout(request, { redirectTo: '/' })
		return null
	}

	console.log(ssn.userId)
	return ssn.userId
}

export async function requireAnonymous(request: Request) {
	await authenticator.isAuthenticated(request, {
		successRedirect: '/',
	})
}

export async function resetUserPassword({
	username,
	password,
}: {
	username: User['username']
	password: string
}) {
	const hashedPassword = await bcrypt.hash(password, 10)
	// return prisma.user.update({
	// 	where: { username },
	// 	data: {
	// 		password: {
	// 			update: {
	// 				hash: hashedPassword,
	// 			},
	// 		},
	// 	},
	// })

	return await db
		.update(pass)
		.set({
			hash: hashedPassword,
		})
		.where(eq(pass.userId, user.id))
		.run()
}

export async function signup({
	email,
	username,
	password,
	name,
}: {
	email: User['email']
	username: User['username']
	name: User['name']
	password: string
}) {
	const hashedPassword = await getPasswordHash(password)

	const usr = await db
		.insert(user)
		.values({
			id: createId(),
			email,
			username,
			name,
			updatedAt: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		})
		.returning({
			id: user.id,
		})
		.run()

	await db
		.insert(pass)
		.values({
			hash: hashedPassword,
			userId: usr.rows[0].id as string,
		})
		.run()

	const Session = await db
		.insert(session)
		.values({
			id: createId(),
			userId: usr.rows[0].id as string,
			expirationDate: new Date(
				Date.now() + SESSION_EXPIRATION_TIME,
			).toISOString(),
			createdAt: new Date().toISOString(),
		})
		.returning()
		.run()

	return Session.rows[0]
}

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}

export async function verifyLogin(
	username: User['username'],
	password: Password['hash'],
) {
	const userWithPassword = (
		await db
			.select()
			.from(user)
			.fullJoin(pass, eq(user.id, pass.userId))
			.where(eq(user.username, username))
			.run()
	).rows[0]

	console.log(userWithPassword)

	if (!userWithPassword || !userWithPassword.hash) {
		return null
	}

	const isValid = await bcrypt.compare(
		password,
		userWithPassword.hash as string,
	)

	if (!isValid) {
		console.log('invalid password')
		return null
	}

	console.log('valid password')

	return { id: userWithPassword.id }
}
