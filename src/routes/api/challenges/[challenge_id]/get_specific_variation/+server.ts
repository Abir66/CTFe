import {json} from '@sveltejs/kit'
import Problem from '$lib/server/database/problem'

export async function POST({ locals,params,request }) {
    const { challenge_id } = params
    let user_id = locals.user ? locals.user.id : 0

    const data = await request.json();

    const variation_id = data.variation_id ? data.variation_id : 0;

    let response = await Problem.get_problem(challenge_id, user_id, variation_id);
    if(!response.success) {
        console.log(response);
        return json({error: "Something went wrong"});
    }

    console.log('Here', challenge_id, response.data[0].problem);

    let challenge = response.data[0].problem;
    return json(challenge)
}

