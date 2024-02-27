import {json} from '@sveltejs/kit'
import Teams from '$lib/server/database/teams'


export async function POST({ locals,params,request}) {
   
    if(!locals.user) {
        return json({success: false, message: "Not logged in"});
    }

    const team_id = params.team_id;
    const user_id = locals.user.id;
    const data = await request.json();
    
    if(data.checked == undefined || data.checked == null) {
        return json({success: false, message: "Invalid request"});
    }
    const allow = data.checked;

    const password_status_response = await Teams.get_team_password_status(team_id);

    if(password_status_response.error) return json({success: false, message: "Something went wrong"});
    if(password_status_response.data.length == 0) return json({success: false, message: "Team not found"});
    if(password_status_response.data[0].leader_id != user_id) return json({success: false, message: "You are not the leader of this team"});
    if(!password_status_response.data[0].password_set) return json({success: false, message: "Password not set"});


    // set allow join via password
    const response = await Teams.set_allow_join_via_password(team_id, allow);

    if(response.error) return json({success: false, message: "Something went wrong"});

    let message;
    if(allow) message = "Joining via password turned on";
    else message = "Joining via password turned off";

    
    return json({success: true, message: message});
}