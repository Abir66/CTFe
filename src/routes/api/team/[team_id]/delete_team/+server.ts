import {json} from '@sveltejs/kit'
import Teams from '$lib/server/database/teams'


export async function POST({ locals,params,request}) {
   
    if(!locals.user) {
        return json({success: false, message: "Not logged in"});
    }

    const team_id = params.team_id;
    const user_id = locals.user.id;

    // check leader access
    const leader_id_response = await Teams.get_leader_id(team_id);

    if(leader_id_response.error) return json({success: false, message: "Something went wrong"});
    if(leader_id_response.data.length == 0) return json({success: false, message: "Team not found"});
    if(leader_id_response.data[0].leader_id != user_id) return json({success: false, message: "You are not the leader of this team"});
    

    // delete team
    const delete_response = await Teams.delete_team(team_id);
    if(delete_response.error) return json({success: false, message: "Something went wrong"});

    return json({success: true, message: "Password set successfully"});
}