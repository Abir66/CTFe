export const load =  async (serverLoadEvent) => {
    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    // const response = await fetch("/dummyAPI/contests/"+contest_id); 
    // const data = await response.json();
    const { data, error } = await serverLoadEvent.locals.supabase.from('contest').select(`
    *,
    organizers: users  ( id, username ),
    team_shortlist: teams (id ,name)
  `).eq('id', contest_id).single();
    
  console.log(data);
  
	return {
        contest_details : data
	};
}