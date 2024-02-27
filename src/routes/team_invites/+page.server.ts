import Teams from '$lib/server/database/teams';
import { error } from '@sveltejs/kit';

export const load = async ({params, locals}) => {
	
    if(!locals.user)  return error(403, "Not logged in");
    
    const user_id = locals.user.id;
    
    let team_invites_response = await Teams.get_team_invites(user_id);
    if(team_invites_response.error) {
        console.error(team_invites_response.error);
        return error(500, "Something went wrong");
    }

    return {
        team_invites: team_invites_response.data
    };
}


