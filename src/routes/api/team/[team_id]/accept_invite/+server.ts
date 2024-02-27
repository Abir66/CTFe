import {json} from '@sveltejs/kit'
import contest_registration from '$lib/server/database/contest_registration.js';

export async function POST({ locals,params,request}) {
   
    if(!locals.user) {
        return json({success: false, message: "Not logged in"});
    }

    const team_id = params.team_id;
    const user_id = locals.user.id;
    
    const response = await contest_registration.join_team_via_invite(user_id, team_id);
    console.log(response);

    if(response.error){
        console.log(response.error);
        return json({success: false, message: "Something went wrong"});
    }

    const result = response.data[0].result;
    if(result == 'success') 
        return json({success: true, message: "Invite accepted successfully"});
    return json({success: false, message: result});
}