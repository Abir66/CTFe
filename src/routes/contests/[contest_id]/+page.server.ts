export const load = async ({params, locals}) => {
	const contest_id = params.contest_id;
	const { data: contest_details, error } = await locals.supabase
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
			contest_details.team_shortlist.map((team: any) => JSON.stringify({ id: team.id, name: team.name }))
		)
	).map(teamStr => JSON.parse(teamStr));


	contest_details.team_shortlist = distinctTeams;


	let response
	
	if(locals.user){
		response = await locals.supabase.rpc('registration_eligibility', {p_contest_id: contest_id, p_user_id: locals.user.id});
	}
	else{
		response = await locals.supabase.rpc('registration_eligibility', {p_contest_id: contest_id, p_user_id: 0});
	}
	
	const data = {
		contest_details: contest_details,
	}
	
	if(!response.error && response.data.status){
		if(response.data.status == "eligible"){
			data["registration_eligibility"] = true;
		}

		else if(response.data.status == "already registered"){
			data["already_registered"] = true;
		}
	} 
	
	return data;
}