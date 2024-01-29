export const load = async (serverLoadEvent) => {
	const contest_id = serverLoadEvent.params.contest_id;
	const { data, error } = await serverLoadEvent.locals.supabase
		.from('contests')
		.select(`
			*,
			organizers: users!organizers( id, username ),
			team_shortlist:  teams!team_members (id ,name)
			`)
		.eq('id', contest_id)
		.single();

	const distinctTeams = Array.from(
		new Set(
			data.team_shortlist.map((team: any) => JSON.stringify({ id: team.id, name: team.name }))
		)
	).map(teamStr => JSON.parse(teamStr));


	data.team_shortlist = distinctTeams;

	if (error) console.error('Supabase error in contests/contest_id:', error);

	return {
		contest_details: data
	}

}