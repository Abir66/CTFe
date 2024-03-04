import contest from '$lib/server/database/contest.js';
import { error } from '@sveltejs/kit';
import user from '$lib/server/database/users.js';
export const load = async ({url,params,locals}) => {
  
    let user_id = params.user_id;
    const res = await user.is_user_exist(user_id);
   
    if(!res)
    {
        return error(404, "User not found");
    }
  
    const response = await user.user_created_blogs_list(user_id);
    return {    
        blogs_list: response.data,
        user_id: locals.user.id,
        is_same_user: locals.user.id == user_id,
        username: locals.user.username 
    }
    
}