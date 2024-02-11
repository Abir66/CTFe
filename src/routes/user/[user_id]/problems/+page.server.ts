import contest from '$lib/server/database/contest.js';
import { error } from '@sveltejs/kit';
import user from '$lib/server/database/users.js';


export const load = async ({url,params,locals}) => {
    let user_id = params.user_id;
    const res = await user.is_user_exist(user_id);
    console.log(res);
    if(!res)
    {
        return error(404, "User not found");
    }
  
    const response = await user.user_solved_problems(user_id);
    return {    
        problem_list: response.data
    }
}