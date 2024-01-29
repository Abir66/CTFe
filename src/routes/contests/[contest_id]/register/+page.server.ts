import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { fail } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';


let contest_id = "";
let user_id = 0;


export const load: PageServerLoad = async ({params,locals}) => {

    if(!locals.user) {
        error(401, "You must be logged in to register for a contest");
    }
        
    contest_id = params.contest_id;
    user_id = locals.user.id;
    const supabase = locals.supabase;
    const dupTeamCheck = await supabase.rpc('does_team_exist', {u_id: user_id, c_id: contest_id})
    if(dupTeamCheck.error){
        console.error('error', dupTeamCheck.error);
        return fail(500, { dupTeamCheck });
    }

    if(dupTeamCheck.data == true){
        const redirect_url = "/contests/" + contest_id + "/my_team";
        redirect(303, redirect_url);
    }
}

export const actions: Actions = {
	create: async ({ request, url, locals: { supabase } }) => {
        const form_data = await request.formData();
        const team_name = form_data.get("team_name");

        const { error:teams_error } = await supabase.from('teams').insert([{ name: team_name, contest_id: contest_id, leader_id: user_id },])
        if (teams_error) {
            if(teams_error.message.includes("duplicate key value violates unique constraint")){
                return { create_team_error : `Team "${team_name}"already exists` };
            }
            return fail(500, { create_team_error : "Something went wrong" });
        }
        const redirect_url = "/contests/" + contest_id + "/my_team";
        redirect(303, redirect_url);
	},


    join: async ({ request, url, locals: { supabase } }) => {
    
        const form_data = await request.formData();
        const team_name = form_data.get("team_name");
        const password = form_data.get("password");
        
        const response = await supabase.rpc('join_team_via_password', {
            p_user_id: user_id,
            p_contest_id: contest_id, 
            p_team_name: team_name, 
            p_password: password
        })
        
        if(response.error){
            return fail(500, { join_team_error : "Something went wrong" });
        }

        if(response.data == "success"){
            const redirect_url = "/contests/" + contest_id + "/my_team";
            redirect(303, redirect_url);
        }

        return { join_team_error : response.data };
	}
};