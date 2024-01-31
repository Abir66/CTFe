import contest from '$lib/server/database/contest.js';
import { error } from '@sveltejs/kit';

export const load = async ({url,params,locals}) => {
    let search_str = url.searchParams.get('search_str');
    let type = url.searchParams.get('type');
    let status = url.searchParams.get('status');

    const res = await contest.get_contest_list(search_str, type, status);

    if(res.error){
        console.error(res.error);
        return error(500, "something went wrong");
    }
  
    return {
        contest_list: res.data
    };
}