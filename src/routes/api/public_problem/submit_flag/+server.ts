import {json} from '@sveltejs/kit'
import Problem from '$lib/server/database/problem.js'

export async function POST({ locals,params,request}) {   
    if(!locals.user) {
        return json({success: false, message: "Not logged in"});
    }

    const data = await request.json();
    
    if(!data.problem_id || !data.variation_id || !data.flag) {
        return json({success: false, message: "Invalid request"});
    }
    
    const response = await Problem.upsolve_submit_flag(data.problem_id, data.variation_id, locals.user.id, data.flag);

    if(!response.success) {
        console.log(response.error)
        return json({success: false, message: "Something went wrong"});
    }

    return json({success: true, data : response.data[0].submit_response});
}