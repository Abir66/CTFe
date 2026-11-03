
import { run_query } from '$lib/server/database/database';
import Contest from '$lib/server/database/contest'
import { error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import createContest from '$lib/server/database/contest_creation';
import type { Actions } from './$types';
export const load = async ({ params, locals }) => {

	const contest_id = params.contest_id;
	const contest_details = await Contest.get_contest_details(contest_id);

	if (!contest_details.success) return error(500, "Internal Server Error");
	else if (contest_details.data.length == 0) return error(404, "Contest not found");

	const [organizers] = await Promise.all([
		Contest.get_contest_organizers(contest_id)
	]);

	let data = {
		contest_details: contest_details.data[0],
		organizers: organizers.data,
		contest_id: contest_id
	}

	return data;
}


export const actions: Actions = {
	edit: async ({ request, url, params }) => {

		const formdata = await request.formData();
		const body = Object.fromEntries(formdata);
		console.log('body', body);
		const start_date = new Date(body.begindate.toString() + "," + body.begintime.toString());
		const end_date = new Date(body.enddate.toString() + "," + body.endtime.toString());
		if (body.title == "" || body.description == "" || body.begindate == "" || body.begintime == "" || body.enddate == "" || body.endtime == "" || body.duration == "") {
			return fail(400, { emptyfields: true });
		}
		// else if (body.begindate < new Date().toISOString().split('T')[0]) {
		// 	return fail(400, { begindatebeforenow: true });
		// }
		else if (body.enddate < body.begindate) {
			return fail(400, { enddatebeforebegindate: true });
		}
		else if (body.enddate == body.begindate && body.endtime <= body.begintime) {
			return fail(400, { enddatebeforebegindate: true });
		}

		let result = await createContest.update_contest(
			body.title, 
			start_date, 
			end_date, 
			body.type, 
			body.type == "private" ? body.password : null, 
			body.maxmember, 
			params.contest_id,
			body.registration_paused,
		);
		//    console.log(result);

		if (result.success) {

			throw redirect(303, '/contests/' + params.contest_id + '/organizer/general');

		}

	},

	delete: async ({ request, url, params }) => {

		const formdata = await request.formData();
		const body = Object.fromEntries(formdata);


		let result = await createContest.delete_contest(params.contest_id);
		
		if (result.success) {
			throw redirect(303, '/contests');
		}

	},

	addcollab: async ({ request, url, params }) => {


		// console.log(new Date().toLocaleString());
		// console.log(new Date().toISOString());

		const formdata = await request.formData();
		const body = Object.fromEntries(formdata);
		console.log(body);

		let result = await run_query('SELECT id FROM users WHERE username = $1', [body.username]);
		if (!result.success) {
			return fail(500, { usernotfound: false, alreadycollab: false });
		}
		if (result.data.length == 0) {
			return fail(400, { usernotfound: true });
		}

		else {
			let result2 = await run_query('INSERT INTO organizers (contest_id, user_id) VALUES ($1, $2)', [params.contest_id, result.data[0].id]);

			if (!result2.success) {
				return fail(400, { alreadycollab: true });
			}
			else {
				throw redirect(303, '/contests/' + params.contest_id + '/organizer/general');
			}

		}
		
	},
};


