import {json} from '@sveltejs/kit'

export async function GET({ locals,params,request,query }) {
    let user_id = locals.user ? locals.user.id : 0
    const data = params;
    return json({status: true})
}