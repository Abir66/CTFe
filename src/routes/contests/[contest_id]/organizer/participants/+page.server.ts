import { error } from '@sveltejs/kit';
import Contest from '$lib/server/database/contest.js';
export const load = async ({url,fetch,params,locals}) => {
    let search_username = url.searchParams.get('search_username');
    if(search_username === null) search_username = '';
    const contest_id = params.contest_id
    const participants = await Contest.get_participant_list(contest_id, search_username);
    if(!participants.success){
        console.log(participants.error);
        return error(500, 'Something went wrong');
    }

    return {
        participants : participants.data,
        contest_id,
        search_username
    };
}