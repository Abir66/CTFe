import { error } from '@sveltejs/kit';
import {json} from '@sveltejs/kit';
import Teams from '$lib/server/database/teams'

export async function GET({ locals,params,url  }) {
    const response = await Teams.search_user_by_name(url.searchParams.get('invite_string'),url.searchParams.get('contest_id'),url.searchParams.get('team_id'));  
    console.log("response",response); 
    return json({ success: true, response: response })
}

export async function POST({locals,params,request}) {

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

    const response = await Teams.invite_member(locals.user.id,data.invitee_id,data.contest_id);  
    console.log("response",response); 
    return json({ success: true,response: response})
}