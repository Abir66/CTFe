import {json} from '@sveltejs/kit'
import Teams from '$lib/server/database/teams'
import Contest from '$lib/server/database/contest.js';


export async function POST({ locals,params,request}) {
    const data = await request.json();
    const team_id = data.team_id;
    
    if(!team_id) return json({success: false, message: "Invalid request"});
    

    // check the contest status
    const contest_id = params.contest_id;
    const contest_status = await Contest.get_contest_status(contest_id);
    if(contest_status.error) return json({success: false, message: "Something went wrong"});
    if(contest_status.data.length == 0) return json({success: false, message: "Contest not found"});
    const status = contest_status.data[0].status;
    if(!status.status || status.status == 'finished') return json({success: false, message: "Can not delete team after the contest has finished"});

    
    // check if the team belongs to that contest
    const team_info_response = await Teams.get_team_info(team_id);
    if(team_info_response.error) return json({success: false, message: "Something went wrong"});
    if(team_info_response.data.length == 0) return json({success: false, message: "Team not found"});
    const team_info = team_info_response.data[0];
    if(team_info.contest_id != contest_id) return json({success: false, message: "Invalid request"});

    
    
    // delete team
    // const delete_response = await Teams.delete_team(team_id);
    // if(delete_response.error) return json({success: false, message: "Something went wrong"});

    return json({success: true, message: "Team deleted successfully"});
}