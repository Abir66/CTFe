import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { fail } from '@sveltejs/kit';


let contest_id = "";
let user_id = 0;


export const load: PageServerLoad = async ({params,locals}) => {
    contest_id = params.contest_id;
    user_id = locals.user.id;
    const supabase = locals.supabase;
    const dupTeamCheck = await supabase.rpc('does_team_exist', {u_id: user_id, c_id: contest_id})
    if(dupTeamCheck.error){
        console.error('error', dupTeamCheck.error);
        fail(500, { dupTeamCheck });
    }
    if(dupTeamCheck.data == true){
        const redirect_url = "/contests/" + contest_id + "/my_team";
        redirect(303, redirect_url);
    }
}

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase } }) => {
        const form_data = await request.formData();
        const team_name = form_data.get("team_name");

        const { data: teams_data, error:teams_error } = await supabase.from('teams').insert([{ name: team_name, contest_id: contest_id, leader: user_id },]).select()
        if (teams_error) {
            console.error('error', teams_error);
            fail(500, { teams_error });
        }
        if (teams_data && teams_data[0]) {
            const { data: register_data, error:register_error } = await supabase.from('register').insert([{ contest_id: contest_id, user_id: user_id, team_id: teams_data[0].id },]).select()
            if (register_error) {
                console.error('error', register_error);
                fail(500, { register_error });
            }
        }
        const redirect_url = "/contests/" + contest_id + "/my_team";
        redirect(303, redirect_url);
	}
};