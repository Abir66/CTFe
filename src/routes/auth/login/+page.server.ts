import {  message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { run_query } from '$lib/server/database/database';
import { create_session, verify_password } from '$lib/server/auth';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
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
		const email = form.data.email;
		const password = form.data.password;
		
		const result = await run_query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
		if (!result.success) {
			console.error('error', result.error);
			return fail(500, { form });
		}

		const user = result.data[0];
		if (!user || !(await verify_password(password, user.password_hash))) {
			return setError(form, 'password', 'Invalid e-mail or password.');
		}

		const session = await create_session(cookies, user.id);
		if (!session.success) {
			console.error('error', session.error);
			return fail(500, { form });
		}

		// redirect to previous page
		// Yep, return { form } here too
		return message(form, 'success');
	}
};