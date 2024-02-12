import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import teams from '$lib/server/database/teams';
import contest_clarification from '$lib/server/database/contest_clarification';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { fail } from '@sveltejs/kit';

let contest_id = "";
let user_id = 0;
let team_id = 0;
let leader_id = 0;
let team_members = [];
let contest_member_limit = 0;
let error_message = "";
let togle = false;
export const load: PageServerLoad = async ({params,locals}) => {
    if(togle == false && error_message != "") {
        togle =true
    }else if(togle == true && error_message != "") {
        error_message = ""
        togle = false
    }
    contest_id = params.contest_id;
    user_id = locals.user.id;

    let result = await contest_clarification.get_team_id(user_id,contest_id);
    team_id = result.data[0].id;

    result = await teams.get_team_info(team_id);
    console.log(result);
    leader_id = result.data[0].leader_id;
    const team_name = result.data[0].name;

    result = await teams.get_team_members(team_id);
    team_members = result.data;

    result = await teams.get_member_limit(contest_id);
    contest_member_limit = result.data[0].memberlimit;


    return {
        props: {
            team_members,
            team_id,
            leader_id,
            contest_member_limit,
            error_message,
            team_name
        }
    }
}

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase } }) => {
        const form_data = await request.formData();
        const user_name = form_data.get("user_name");


        let { data, error } = await supabase.rpc('if_available_for_team', {c_id:contest_id,u_name:user_name})
        if (error){
            fail(500, { error });
        }

        if(!data){
            error_message = "User not eligible for joinig team"
        }
        else{
            team_members = team_members.concat(data);
            const { data: add_member_data, error: add_member_error } = await supabase.from('team_members').insert([{ contest_id: contest_id, team_id: team_id, user_id: data[0].id },]).select()
            if (add_member_error) {
                console.error('error', add_member_error);
                fail(500, { add_member_error });
            }
            
            redirect(303, url.pathname);
        }
	}
};