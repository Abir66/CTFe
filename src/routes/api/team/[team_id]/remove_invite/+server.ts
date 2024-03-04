import {json} from '@sveltejs/kit'
import Teams from '$lib/server/database/teams'


export async function POST({ locals,params,request}) {
   
    if(!locals.user) {
        return json({success: false, message: "Not logged in"});
    }

    const team_id = params.team_id;
    const user_id = locals.user.id;
    const data = await request.json();
    
    if(data.member_id == undefined || data.member_id == null) {
        return json({success: false, message: "Invalid request"});
    }
    const member_id = data.member_id;

    // check leader access
    const team_info_response = await Teams.get_team_info(team_id);

    if(team_info_response.error) return json({success: false, message: "Something went wrong"});
    if(team_info_response.data.length == 0) return json({success: false, message: "Team not found"});
    if(member_id != user_id && team_info_response.data[0].leader_id != user_id) return json({success: false, message: "You are not the leader of this team"});
   
    const response = await Teams.remove_invite(team_id, member_id);
    if(response.error){
        console.log(response.error);
        return json({success: false, message: "Something went wrong"});
    }

    return json({success: true, message: "Invite removed successfully"});
}