import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
    flag: z.string().min(1),
});
let contest_id = 0;
let challenge_id = 0;
let message = "";
let toggle = false;
export const load =  async (serverLoadEvent) => {

    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    const challenge_id = serverLoadEvent.params.challenge_id;

	let result = await serverLoadEvent.locals.supabase.rpc('get_contest_status', {p_contest_id : contest_id})
    
    console.log(result);
    
    if( result.data == 'contest not found'){
        error(404, "Contest not found");
    }
    else
    {
        if(result.data == 'upcoming'){
            error(403, "Contest not started yet");
        }
    }

	if(!toggle && message != ""){
		message = "";
	}else if(toggle){
		toggle = false;
		message = message;
	}
    const {locals} = serverLoadEvent;

	let { data:challenge_details_data, error:challenge_details_error } = await locals.supabase.rpc('get_contest_challenge_details', {c_id:contest_id, p_id:challenge_id})

	let { data: challenge_author_data, error: challenge_author_error } = await locals.supabase.from('users').select('id,username').eq('id', challenge_details_data.author_id)
	// get challenge attachments
	const attachments= [
		{ name: 'flag_generator.py', url: 'https://google.com' },
		{ name: 'encrypted.txt', url: 'https://google.com' }
	]
	// get challenge attempts and flag format
	const attempted = 3
	const flag_format = "buet_ctf{Th1s_1s_4n_3x4mpl3_f14g}"
	const json_data = {
		id:challenge_details_data.id,
		name:challenge_details_data.title,
		score:challenge_details_data.score,
		author: challenge_author_data[0],
		description:challenge_details_data.description,
		attachments,
		max_attempts:challenge_details_data.max_attempts,
		attempted,
		flag_format
	}


	const form = await superValidate(schema);

	return {
        challenge : json_data,
        form,
		message
	};
}


export const actions: Actions = {
	submitFlag: async ({ request,locals }) => {
		message = "clicked"
		// Use superValidate in form actions too, but with the request
		const form = await superValidate(request, schema);
        console.log("Got flag - ", form.data.flag)
		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		// chcck max attempts

		let { data, error } = await locals.supabase.rpc('check_submitted_flag', {c_id:contest_id, p_id:challenge_id, submission:form.data.flag})
		if (error){
			fail(500, { form });
		}

		if(!data){
			message = "wrong flag"
		}else{
			message = "correct"
		}
		if(form.data.flag == ""){
			message = ""
		}
		toggle = true;
		// TODO: Do something with the validated data

		// Yep, return { form } here too
		//return { form };
	}
};