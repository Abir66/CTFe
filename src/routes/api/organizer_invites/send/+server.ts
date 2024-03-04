import { error } from '@sveltejs/kit';
import {json} from '@sveltejs/kit';
import Users from '$lib/server/database/users'

export async function GET({ locals,params,url  }) {
    const response = await Users.search_user_by_name_organizer(url.searchParams.get('invite_string'),url.searchParams.get('contest_id'));  
    return json({ success: true, response: response })
}

export async function POST({locals,params,request}) {
    console.log("in post api endpoint");
    if(!locals.user) {
        return json({success: false, message: "Not logged in"});
    }

    const data = await request.json();

    if(!data.invitee_id) {
        return json({success: false, message: "Invitee id not provided"});
    }

    if(!data.contest_id) {
        return json({success: false, message: "Contest id not provided"});
    }
    const response = await Users.invite_member(locals.user.id,data.invitee_id,data.contest_id);  
    console.log("response",response); 
    return json({ success: true,response: response})
}