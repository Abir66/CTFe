import {json} from '@sveltejs/kit'
import Problem from '$lib/server/database/problem'

export async function GET({ locals,params }) {
    const { challenge_id } = params
    let user_id = locals.user ? locals.user.id : 0

    let response = await Problem.get_problem(challenge_id, user_id);
    if(!response.success) {
        return json({error: "Something went wrong"});
    }

    console.log(response.data[0].problem);

    let challenge = response.data[0].problem;
    return json(challenge)
}