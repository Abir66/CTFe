import type { PageServerLoad } from './$types';
import teams from '$lib/server/database/teams';
import { error } from '@sveltejs/kit';


export const load: PageServerLoad = async ({params,locals}) => {
    
    if(!locals.user)  return error(403, "Not logged in");
    const contest_id = params.contest_id;
    const user_id = locals.user.id;

    
    const team_id_response = await teams.get_team_id(user_id,contest_id);
    if(team_id_response.error) {
        console.error(team_id_response.error);
        return error(500, "Something went wrong");
    }
    if(team_id_response.data.length == 0) return error(404, "Team not found");
    const team_id = team_id_response.data[0].team_id;


    const team_info_response = await teams.get_team_info(team_id);
    if(team_info_response.error) {
        console.error(team_info_response.error);
        return error(500, "Something went wrong");
    }

    const leader_id = team_info_response.data[0].leader_id;
    if(leader_id != user_id) return error(403, "You are not the leader of this team");


    const team_members_response = await teams.get_team_members(team_id);
    if(team_members_response.error) {
        console.error(team_members_response.error);
        return error(500, "Something went wrong");
    }

    const invited_members_response = await teams.get_invited_members(team_id);
    if(invited_members_response.error) {
        console.error(invited_members_response.error);
        return error(500, "Something went wrong");
    }


    return {
        contest_id: contest_id,
        team_id: team_id,
        team_members: team_members_response.data,
        team_info: team_info_response.data[0],
        invited_members: invited_members_response.data
    }

}
