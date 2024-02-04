
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import ContestRegistration from '$lib/server/database/contest_registration'
import Contest from '$lib/server/database/contest'


import { z } from 'zod'
import { message, superValidate } from 'sveltekit-superforms/server';

const team_create_scheme = z.object({
    team_name: z.string().min(3).max(20),
    contest_password: z.string().nullable()
});

const team_join_scheme = z.object({
    team_name: z.string().min(3).max(20),
    team_password: z.string().min(4)
});


export const load: PageServerLoad = async ({params,locals}) => {

    const contest_type_response = await Contest.get_contest_type(params.contest_id);
    
    if(contest_type_response.error) error(500, "Something went wrong");
    if(contest_type_response.data.length == 0) error(404, "Contest not found");
    if(!locals.user) error(401, "You must be logged in to register for a contest");
    
    
    const user_id = locals.user.id;
    const contest_type = contest_type_response.data[0].type;


    const response = await ContestRegistration.does_user_have_team(user_id, parseInt(params.contest_id));

    if(response.error) return error(500, "Something went wrong");
    if(response.data.length > 0) redirect(303, "/contests/" + params.contest_id + "/my_team");
    

    const team_create_form = await superValidate(team_create_scheme);
    const team_join_form = await superValidate(team_join_scheme);

    return{
        contest_type,
        team_create_form,
        team_join_form
    }
}

export const actions: Actions = {
	create: async ({ request, params, locals}) => {
        const team_create_form = await superValidate(request, team_create_scheme);
        if (!team_create_form.valid) return fail(400, { team_create_form});

        if(!locals.user) error(401, "You must be logged in to register for a contest");

        const team_name = team_create_form.data.team_name;
		const contest_password = team_create_form.data.contest_password;

        const respose = await ContestRegistration.create_team(locals.user.id, params.contest_id, team_name, contest_password);
        console.log("respose", respose);

        if(respose.error) return message(team_create_form, 'Something went wrong');
        if(respose.data[0]['result'] == 'success') redirect(303, "/contests/" + params.contest_id + "/my_team");
        return message(team_create_form, respose.data[0]['result']);
	},


    join: async ({ request, params, locals}) => {

        const team_join_form = await superValidate(request, team_join_scheme);
        if (!team_join_form.valid) return fail(400, { team_create_form: team_join_form});

        if(!locals.user) error(401, "You must be logged in to register for a contest");

        const team_name = team_join_form.data.team_name;
		const team_password = team_join_form.data.team_password;

        const respose = await ContestRegistration.join_team_via_password(locals.user.id, params.contest_id, team_name, team_password);
        console.log("respose", respose);

        if(respose.error) return message(team_join_form, 'Something went wrong');
        if(respose.data[0]['result'] == 'success') redirect(303, "/contests/" + params.contest_id + "/my_team");
        return message(team_join_form, respose.data[0]['result']);
	}
};