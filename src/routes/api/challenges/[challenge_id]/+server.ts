import {json} from '@sveltejs/kit'
import Problem from '$lib/server/database/problem'

export async function GET({ locals,params }) {
    const { challenge_id } = params
    let user_id = locals.user ? locals.user.id : 0

    let response = await Problem.get_problem(challenge_id, user_id);
    if(!response.success) {
        console.log(response);
        return json({error: "Something went wrong"});
    }

    console.log('Here', challenge_id, response.data[0].problem);

    let challenge = response.data[0].problem;
    return json(challenge)
}


export async function POST({ locals,params,request}) {

    if(!locals.user) {
        return json({error: "You must be logged in to submit a flag"});
    }

    const formData = await request.formData()
    const flag = formData.get('flag')
    console.log(flag);

    if(!flag) {
        return json({error: "Invalid flag"});
    }

    const response = await Problem.submit_flag(params.challenge_id, locals.user.id, flag);
    if(!response.success) {
        console.log(response);
        return json({error: "Something went wrong"});
    }

    return json(response.data[0].submit_response);
}