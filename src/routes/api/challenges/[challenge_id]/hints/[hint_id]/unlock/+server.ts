import {json} from '@sveltejs/kit'
import ContestProblems from '$lib/server/database/contest_problems'

export async function POST({ locals,params }) {

    if (!locals.user) {
        return json({ success: false, message: "You must be logged in to unlock hints" })
    }

    const { hint_id } = params

    let user_id = locals.user ? locals.user.id : 0
    const response = await ContestProblems.unlock_hint(hint_id,user_id)

   
    if(response.error){
        return json({ success: false, message: "Something went wrong" })
    }

    const hint = response.data[0]['hint']

    if(hint.error){
        return json({ success: false, message: hint.error })
    }

    return json({ success: true, hint: hint })
    
}