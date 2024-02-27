import { error } from '@sveltejs/kit';
import contest from '$lib/server/database/contest.js';


export const load = async ({params,locals}) => {
    const contest_id = params.contest_id;
    const user_id = locals.user ? locals.user.id : 0;
	const response  = await contest.get_contest_layout_data(contest_id, user_id);

    if(response.error){
        console.log(response.error);
        return error(500, "something went wrong");
    }

    if(response.data.length == 0){
        return error(404, "contest not found");
    }

    return {
        contest : response.data[0].layout_data,
        contest_id : contest_id
    }

}