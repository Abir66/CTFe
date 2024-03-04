import {json} from '@sveltejs/kit'
import contest_problems from '$lib/server/database/contest_problems.js';


export async function GET({ locals,params,request}) {
   
    const problem_id = params.challenge_id;

    const response = await contest_problems.get_solves_for_a_problem(problem_id);
    console.log(response);
    if(response.error) return json({success: false, message: "Something went wrong."});
    return json({success: true, data : response.data});
}