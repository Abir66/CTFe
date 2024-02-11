import {json} from '@sveltejs/kit'
import ContestProblems from '$lib/server/database/contest_problems'

export async function GET({ locals,params }) {
    const { challenge_id } = params
    let user_id = locals.user ? locals.user.id : 0
    const respone = await ContestProblems.get_hints(challenge_id,user_id)
    console.log("Response - ", JSON.stringify(respone))

    if(respone.success){
        return json(respone.data[0]['hints'])
    }

    else{
        return json([])
    }
}