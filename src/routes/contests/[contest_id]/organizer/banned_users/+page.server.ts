import { error } from '@sveltejs/kit';
import Contest from '$lib/server/database/contest.js';
export const load = async ({url,fetch,params,locals}) => {
    let search_user_name = url.searchParams.get('search_user_name');
    if(search_user_name === null) search_user_name = '';
    const contest_id = params.contest_id
    const banned_users = await Contest.get_banned_users(contest_id, search_user_name);

    console.log(banned_users);
    if(!banned_users.success){
        console.log(banned_users.error);
        return error(500, 'Something went wrong');
    }

    return {
        banned_users : banned_users.data,
        contest_id,
        search_user_name: search_user_name
    };
}