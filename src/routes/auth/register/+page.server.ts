import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

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
	default: async ({ request, url, locals: { supabase } }) => {
		// Use superValidate in form actions too, but with the request
		const form = await superValidate(request, schema);
		console.log("here")
		
		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated data
		const {username, email, password} = form.data;


		const dupEmailCheck = await supabase.rpc('does_email_exist', {p_email: email})

		if(dupEmailCheck.error){
			return fail(500, { form });
		}

		else if(dupEmailCheck.data == true){
			return setError(form, 'email', 'E-mail already exists.');
		}

		const dupUsernameCheck = await supabase.rpc('does_username_exist', {p_username: username})

		if(dupUsernameCheck.error){
			return fail(500, { form });
		}

		else if(dupUsernameCheck.data == true){
			return setError(form, 'username', 'Username already exists.');
		}

		
		let signupResponse = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`,
				data: { username },
			},
		})

		if (signupResponse.error) {
			console.error('error', signupResponse.error);
			return fail(500, { form });
		}
		
		console.log('signupResponse', signupResponse.data)
		throw redirect(303, '/auth/verifyEmail')

	}
};