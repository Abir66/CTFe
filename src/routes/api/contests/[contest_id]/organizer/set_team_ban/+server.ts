import {json} from '@sveltejs/kit'
import Teams from '$lib/server/database/teams'
import Contest from '$lib/server/database/contest.js';


export async function POST({ locals,params,request}) {

    const data = await request.json();
    let team_status = data.team_status;
    const team_id = data.team_id;
    const contest_id = params.contest_id;
    
    if(team_status != 'ban' && team_status != 'unban') return json({success: false, message: "Invalid request"});   

    if(!team_id) return json({success: false, message: "Invalid request"});
    
    if(!team_status) return json({success: false, message: "Invalid request"});
    


    // check if the team belongs to that contest
    const team_info_repo = await Teams.get_team_info(team_id);
    if(team_info_repo.error) {
        console.error("Error in set_team_ban: ", team_info_repo.error);
        return json({success: false, message: "Something went wrong"});
    }
    if(team_info_repo.data.length == 0) return json({success: false, message: "Team not found"});
    const team_info = team_info_repo.data[0];
    if(team_info.contest_id != contest_id) return json({success: false, message: "Invalid request"});
    
    
    
    team_status = team_status == 'ban' ? 'banned' : null;

    const ban_response = await Teams.set_team_status(team_id, team_status);
    if(ban_response.error) {
        console.error("Error in set_team_ban: ", ban_response.error);
        return json({success: false, message: "Something went wrong"});
    }

    return json({success: true, message: "Team status updated successfully"});
}