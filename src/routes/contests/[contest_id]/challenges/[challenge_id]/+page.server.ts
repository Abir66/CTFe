import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import users from '$lib/server/database/users';
import problem from '$lib/server/database/problem';
const schema = z.object({
    flag: z.string().min(1),
});

let message = "";
let toggle = false;
export const load =  async (serverLoadEvent) => {

    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    const challenge_id = serverLoadEvent.params.challenge_id;
    const user_id = serverLoadEvent.locals.user ? serverLoadEvent.locals.user.id : 0
	console.log("contest_id",contest_id);
	
	let result = await serverLoadEvent.locals.supabase.rpc('get_contest_status', {p_contest_id : contest_id})
    
    console.log("hehe",result);
    let problem_detail;
    if( result.data == 'contest not found'){
        error(404, "Contest not found");
    }
    else
    {
        if(result.data == 'upcoming'){
            error(403, "Contest not started yet");
        }
		let teams = await users.is_registered_to_contest(contest_id,user_id);
        console.log(teams);
        if(result.data == 'running')
        {
            if(teams.data.length == 0){
               
				problem_detail=await problem.get_any_problem_variation(contest_id,challenge_id);
				console.log(problem_detail);
				
				
            }
            else{  
			
				
				problem_detail=await problem.get_specific_problem_variation(contest_id,challenge_id,teams.data[0].team_id);
				console.log(problem_detail);
            }
        }
        else if(result.data == 'finished'){

			problem_detail=await problem.get_any_problem_variation(contest_id,challenge_id);
			console.log(problem_detail);
        }
    }

	if(!toggle && message != ""){
		message = "";
	}else if(toggle){
		toggle = false;
		message = message;
		console.log(message);
		
	}
    const {locals} = serverLoadEvent;

	

	let { data: challenge_author_data, error: challenge_author_error } = await locals.supabase.from('users').select('id,username').eq('id', problem_detail.data.author_id)
	// get challenge attachments
	const attachments= [
		{ name: 'flag_generator.py', url: 'https://google.com' },
		{ name: 'encrypted.txt', url: 'https://google.com' }
	]
	// get challenge attempts and flag format
	const attempted = 3
	const json_data = {

		challenge: problem_detail.data[0],
		attachments,
		
	}
	console.log(json_data);
	


	const form = await superValidate(schema);

	return {
        challenge : json_data,
        form,
		message
	};
}


export const actions: Actions = {
	submitFlag: async ({ request,locals,params }) => {
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

		let { data, error } = await locals.supabase.rpc('check_submitted_flag', {c_id:params.contest_id, p_id:params.challenge_id, submission:form.data.flag})
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
	  
	}
};