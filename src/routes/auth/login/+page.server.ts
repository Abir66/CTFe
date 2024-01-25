import {  message, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

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
	default: async ({ request, url, locals: { supabase } }) => {
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
		
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		})

		if (error) {
			console.error('error', error);
			return fail(500, { form });
		}

		// redirect to previous page
		// Yep, return { form } here too
		return message(form, 'success');
	}
};