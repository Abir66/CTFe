export const load =  async (serverLoadEvent) => {
    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    // const response = await fetch("/dummyAPI/contests/"+contest_id); 
    // const data = await response.json();
    const { data, error } = await serverLoadEvent.locals.supabase.from('contests').select(`
    *,
    organizers: users!organizers( id, username ),
     team_shortlist:  teams!register (id ,name)
  `).eq('id', contest_id).single();
  
  if(data.team_shortlist != null)
  {
  const distinctTeams = Array.from(
    new Set(
      data.team_shortlist.map((team: any) => JSON.stringify({id: team.id, name: team.name}))
    )
  ).map(teamStr => JSON.parse(teamStr));

  data.team_shortlist = distinctTeams;
  // console.log(data);
    }
if (error) {
  console.error('Supabase error:', error);

}
	return {
        contest_details : data
	};
}