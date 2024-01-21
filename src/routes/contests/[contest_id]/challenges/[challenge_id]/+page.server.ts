import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
    flag: z.string().min(1),
});


export const load =  async (serverLoadEvent) => {
    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    const challenge_id = serverLoadEvent.params.challenge_id;
    const response = await fetch("/dummyAPI/contests/"+contest_id+"/challenges/"+challenge_id);
    const data = await response.json();

    // Server API:

	const form = await superValidate(schema);

	return {
        challenge : data,
        form : form
	};
}



export const actions: Actions = {
	submitFlag: async ({ request }) => {
		const form = await superValidate(request, schema);
		
		console.log("Got Flag", form.data.flag)

		
		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: Do something with the validated data


		// Yep, return { form } here too
		return { form };
	}
};