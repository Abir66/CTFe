import {json} from '@sveltejs/kit'
import Contest from '$lib/server/database/contest';

export async function POST({ locals,params,request}) {

    if(!locals.user)  return json({error: "You must be logged in to enter a private contest"});
    

    const formData = await request.formData()
    const password = formData.get('password')
    console.log(password);

    if(!password) {
        return json({error: "Must provide a password"});
    }

    const response = await Contest.get_private_contest_access(params.contest_id, locals.user.id, password);
    
    if(!response.success) {
        console.log(response);
        return json({error: "Something went wrong"});
    }

    console.log(response.data[0].access);


    return json(response.data[0].access);
}