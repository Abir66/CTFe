import contest from '$lib/server/database/contest';
import Contest from '$lib/server/database/contest'
import { error } from '@sveltejs/kit';

export const load = async ({params, locals}) => {
	
	const contest_id = params.contest_id;
	const contest_details = await Contest.get_contest_details(contest_id);

	if(!contest_details.success) return error(500, "Internal Server Error");
	else if(contest_details.data.length == 0) return error(404, "Contest not found");

	const [organizers, team_shortlist, registration_eligibility, access] = await Promise.all([
		Contest.get_contest_organizers(contest_id),
		Contest.get_contest_teams_shortlist(contest_id),
		Contest.get_registration_eligibility(contest_id, locals.user ? locals.user.id : 0),
		Contest.get_contest_access(contest_id, locals.user ? locals.user.id : 0)
	]);


	let data = {
		contest_details: contest_details.data[0],
		organizers: organizers.data,
		team_shortlist: team_shortlist.data,
		team_count: team_shortlist.success && team_shortlist.data.length > 0 ? team_shortlist.data[0].total_teams : 0,
		registration_eligibility: false,
		already_registered: false,
		access: access.data[0].access,
		contest_id: contest_id
	}

	

	if(registration_eligibility.success && registration_eligibility.data.length > 0){
		data.registration_eligibility = registration_eligibility.data[0].registration_eligibility.status == "eligible";
		data.already_registered = registration_eligibility.data[0].registration_eligibility.status == "already registered";
		// if(data.already_registered) data.team_id = registration_eligibility.data[0].registration_eligibility.team_id;
	}


	return data;

}