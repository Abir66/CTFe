import Users from '$lib/server/database/users';
import { error } from '@sveltejs/kit';

export const load = async ({params, locals}) => {
	
    if(!locals.user)  return error(403, "Not logged in");
    
    const user_id = locals.user.id;
    
    let invites_response = await Users.get_organizer_invites(user_id);
    if(invites_response.error) {
        console.error(invites_response.error);
        return error(500, "Something went wrong");
    }

    return {
        invites: invites_response.data
    };
}


