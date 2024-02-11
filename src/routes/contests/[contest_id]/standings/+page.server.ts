import { error } from '@sveltejs/kit';
import standings from '$lib/server/database/contest_standings';
export const load =  async (serverLoadEvent) => {
    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    
	let result = await serverLoadEvent.locals.supabase.rpc('get_contest_status', {p_contest_id : contest_id})
    
    console.log(result.data);
    
    if( result.data == 'contest not found'){
        error(404, "Contest not found");
    }
    else
    {
        if(result.data == 'upcoming'){
            error(403, "Contest not started yet");
        }
    }
    let standings_data = await standings.get_team_standings(contest_id);
    console.log(standings_data);
	return {
        standings: standings_data.data,
        contest_id: contest_id
	};
}