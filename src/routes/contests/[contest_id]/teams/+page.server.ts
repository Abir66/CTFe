import { error } from '@sveltejs/kit';
import Contest from '$lib/server/database/contest.js';
export const load = async ({url,fetch,params,locals}) => {
    let search_team_name = url.searchParams.get('search_team_name');
    if(search_team_name === null) search_team_name = '';
    const contest_id = params.contest_id
    const teams = await Contest.get_team_list(contest_id, search_team_name);
    if(!teams.success){
        console.log(teams.error);
        return error(500, 'Something went wrong');
    }

    return {
        teams : teams.data,
        contest_id,
        search_team_name: search_team_name
    };
}