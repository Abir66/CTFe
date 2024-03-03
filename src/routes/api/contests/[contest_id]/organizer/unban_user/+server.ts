import {json} from '@sveltejs/kit'
import Teams from '$lib/server/database/teams'
import Contest from '$lib/server/database/contest.js';


export async function POST({ locals,params,request}) {
    const data = await request.json();
    const user_id = data.user_id;
    
    if(!user_id) return json({success: false, message: "Invalid request"});

    const contest_id = params.contest_id;
    
    // check if the user is already in a team
    const team_info_repo = await Teams.get_user_team_info(user_id, contest_id);
    if(team_info_repo.error) return json({success: false, message: "Something went wrong"});    
    if(team_info_repo.data.length > 0) {
        const message = `User is already in team - ${team_info_repo.data[0].team_name}`;  
        return json({success: false, message: message});
    }


    // remove user from banned list
    const remove_response = await Contest.remove_user_ban(user_id, contest_id);
    if(remove_response.error) {
        console.log(remove_response.error);
        return json({success: false, message: "Something went wrong"});
    }

    return json({success: true, message: "User unbanned successfully"});
}