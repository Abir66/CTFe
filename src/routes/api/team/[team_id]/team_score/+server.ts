import {json} from '@sveltejs/kit'
import contest_standings from '$lib/server/database/contest_standings';


export async function GET({ locals,params,request}) {
   
    const team_id = params.team_id;

    if(team_id == undefined || team_id == null) {
        return json({success: false, message: "Invalid request"});
    }

    const response = await contest_standings.get_team_score(team_id);

    if(response.error) return json({success: false, message: "Error fetching team score"});
    if(response.data.length < 1)return json({success: false, message: "Team not found"});    
    return json({success: true, data : response.data[0]});
}