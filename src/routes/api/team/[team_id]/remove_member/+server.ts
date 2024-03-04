import {json} from '@sveltejs/kit'
import Teams from '$lib/server/database/teams'
import Contest from '$lib/server/database/contest.js';


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
    if(team_info_response.data[0].leader_id != user_id) return json({success: false, message: "You are not the leader of this team"});
    if(member_id == user_id) return json({success: false, message: "You cannot remove yourself from the team"});
    if(team_info_response.data[0].leader_id == member_id) return json({success: false, message: "You cannot remove the leader of the team"});


    const contest_id = team_info_response.data[0].contest_id;

    const contest_status_response = await Contest.get_contest_status(contest_id);
    if(contest_status_response.error){
        console.log(contest_status_response.error);
        return json({success: false, message: "Something went wrong"});
    }

    // if(contest_status_response.data[0].status.status != 'upcoming'){
    //     return json({success: false, message: "Contest has already started"});
    // } 

    const response = await Teams.remove_member(team_id, member_id);
    if(response.error){
        console.log(response.error);
        return json({success: false, message: "Something went wrong"});
    }

    return json({success: true, message: "Member removed successfully"});
}