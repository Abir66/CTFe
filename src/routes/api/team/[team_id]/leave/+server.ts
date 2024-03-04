import {json} from '@sveltejs/kit'
import Teams from '$lib/server/database/teams'
import Contest from '$lib/server/database/contest.js';

export async function POST({ locals,params,request}) {
   
    if(!locals.user) {
        return json({success: false, message: "Not logged in"});
    }

    const team_id = params.team_id;
    const user_id = locals.user.id;

    // check leader access
    const leader_id_response = await Teams.get_team_info(team_id);

    if(leader_id_response.error) return json({success: false, message: "Something went wrong"});
    if(leader_id_response.data.length == 0) return json({success: false, message: "Team not found"});
    if(leader_id_response.data[0].leader_id == user_id) return json({success: false, message: "You are the leader of this team. You cannot leave"});
    

    // check the contest status
    const contest_id = leader_id_response.data[0].contest_id;
    const contest_status = await Contest.get_contest_status(contest_id);

    if(contest_status.error) return json({success: false, message: "Something went wrong"});
    if(contest_status.data.length == 0) return json({success: false, message: "Contest not found"});

    const status = contest_status.data[0].status;

    if(!status.status || status.status != 'upcoming') return json({success: false, message: "Can not leave team after the contest has started"});


    // delete team
    const delete_response = await Teams.leave_team(user_id, team_id);
    if(delete_response.error) return json({success: false, message: "Something went wrong"});

    return json({success: true, message: "Team deleted successfully"});
}