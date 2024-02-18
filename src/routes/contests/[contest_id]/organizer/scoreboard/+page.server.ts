import { error } from '@sveltejs/kit';
import ContestStandings from '$lib/server/database/contest_standings.js';
export const load = async ({url,fetch,params,locals}) => {
    let search_team_name = url.searchParams.get('search_team_name');
    let show_banned = url.searchParams.get('show_banned');
    if(search_team_name === null) search_team_name = '';
    if(show_banned === null) show_banned = ''
    const contest_id = params.contest_id
    const teams = await ContestStandings.get_standings_organizer_view(contest_id, search_team_name, show_banned=='yes');
    if(!teams.success){
        console.log(teams.error);
        return error(500, 'Something went wrong');
    }

    // console.log(teams.data)
    return {
        teams : teams.data,
        contest_id,
        search_team_name: search_team_name
    };
}