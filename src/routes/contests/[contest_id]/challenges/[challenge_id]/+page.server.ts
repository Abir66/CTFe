import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import users from '$lib/server/database/users';
import problem from '$lib/server/database/problem';
import flag_submission from '$lib/server/database/contest_submission';

const schema = z.object({
    flag: z.string().min(1),
});

let message = "";
let toggle = false;

let maxed_out = false;
export const load =  async (serverLoadEvent) => {

    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    const challenge_id = serverLoadEvent.params.challenge_id;
    const user_id = serverLoadEvent.locals.user ? serverLoadEvent.locals.user.id : 0
	
	let result = await serverLoadEvent.locals.supabase.rpc('get_contest_status', {p_contest_id : contest_id})
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
        // console.log(teams);
		
		
        if(result.data == 'running')
        {
            if(teams.data.length == 0){
               
				problem_detail=await problem.get_any_problem_variation(contest_id,challenge_id);
				// console.log(problem_detail);
				
            }
            else{  
			
				problem_detail=await problem.get_specific_problem_variation(contest_id,challenge_id,teams.data[0].team_id);
				// console.log(problem_detail.data[0].attempt_count,problem_detail.data[0].max_attempts);
				if(problem_detail.data[0].attempt_count === problem_detail.data[0].max_attempts){
					maxed_out = true;
				}else{
					maxed_out = false;
				}
            }
        }
        else if(result.data == 'finished'){

			problem_detail=await problem.get_any_problem_variation(contest_id,challenge_id);
			// console.log(problem_detail);
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
	//console.log(json_data);
	


	const form = await superValidate(schema);

	return {
        challenge : json_data,
        form,
		message
	};
}


export const actions: Actions = {
	submitFlag: async ({ request,locals,params }) => {

		if(!locals.user){
			
			throw redirect(301, '/auth/login');
		}
		// console.log(locals.user.id);
		
        let teams = await users.is_registered_to_contest(params.contest_id,locals.user.id);
        // console.log(teams);
		
		if(teams.data.length==0){
			throw redirect(301, '/contests/'+params.contest_id+'/register');
		
		}
		const form = await superValidate(request, schema);
        console.log("Got flag - ", form.data.flag)
		// console.log("Got contest_id - ", params.contest_id)
		// console.log("Got challenge_id - ", params.challenge_id)
		let status = await problem.get_problem_status(params.contest_id,params.challenge_id,teams.data[0].team_id);
		console.log("status - ", status)
		if(status){
			message = "you already solved this problem";
			toggle = true;
			return null;
		}
		if(maxed_out){
			message = "no more attempts";
			toggle = true;
			return null;
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		// chcck max attempts

		const test = await flag_submission.check_submitted_flag(locals.user.id,params.contest_id,params.challenge_id,teams.data[0].team_id,form.data.flag);
		if(!test.success){
			fail(500, { form });
		}



		// let { data, error } = await locals.supabase.rpc('check_submitted_flag', {c_id:params.contest_id, p_id:params.challenge_id, submission:form.data.flag})

		//console.log(error);
		if(!test.data[0].exists){
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