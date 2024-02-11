import users from '$lib/server/database/users.js';
import { error } from '@sveltejs/kit';

export const load = async ({url,params,locals}) => {
    let search_str = url.searchParams.get('search_str');
    let type = url.searchParams.get('type');
    let status = url.searchParams.get('status');
    let user_id = params.user_id;
    const res = await users.is_user_exist(user_id);

    if(!res)
    {
        return error(404, "User not found");
    }

    const response = await users.user_organized_contest_list(search_str, type, status, user_id);

    if(response.error){
        console.error(response.error);
        return error(500, "something went wrong");
    }
  
    return {
        contest_list: response.data
    };
}