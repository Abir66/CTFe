import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { run_query } from '$lib/server/database/database';
import { create_session, hash_password } from '$lib/server/auth';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	username: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
});

export const load: PageServerLoad = async () => {
	// Server API:
	const form = await superValidate(schema);

	// Always return { form } in load and form actions.
	return { form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		// Use superValidate in form actions too, but with the request
		const form = await superValidate(request, schema);
		
		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated data
		const {username, email, password} = form.data;

		const dupEmailCheck = await run_query('SELECT 1 FROM users WHERE email = $1', [email]);

		if(!dupEmailCheck.success){
			return fail(500, { form });
		}

		else if(dupEmailCheck.data.length > 0){
			return setError(form, 'email', 'E-mail already exists.');
		}

		const dupUsernameCheck = await run_query('SELECT 1 FROM users WHERE username = $1', [username]);

		if(!dupUsernameCheck.success){
			return fail(500, { form });
		}

		else if(dupUsernameCheck.data.length > 0){
			return setError(form, 'username', 'Username already exists.');
		}

		
		const password_hash = await hash_password(password);
		const insertResponse = await run_query(
			'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
			[username, email, password_hash]
		);

		if (!insertResponse.success) {
			// unique violation from a concurrent registration
			if ((insertResponse.error as any)?.code === '23505') {
				return setError(form, 'email', 'E-mail or username already exists.');
			}
			return fail(500, { form });
		}

		const session = await create_session(cookies, insertResponse.data[0].id);
		if (!session.success) {
			return fail(500, { form });
		}

		throw redirect(303, '/')
	}
};