import { error } from '@sveltejs/kit';
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
    const response = await fetch("/dummyAPI/contests/"+contest_id+"/standings"); // error 404?
    const data = await response.json();
    data.sort((a,b) => a.place - b.place);
    console.log(data);
	return {
        standings: data,
        contest_id: contest_id
	};
}