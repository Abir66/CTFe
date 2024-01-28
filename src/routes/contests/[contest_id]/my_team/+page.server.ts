import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
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
    const supabase = locals.supabase;
    
    let { data:id_leader_data, error:id_leader_error } = await supabase.rpc('get_team_id_and_leader', {c_id: contest_id, u_id: user_id})
    if (id_leader_error){
        console.error(id_leader_error)
        fail(500, { id_leader_error });
    }
    leader_id = id_leader_data[0].leader;
    team_id = id_leader_data[0].id;


    let { data:team_members_data, error:team_members_error } = await supabase.rpc('get_team_members', {c_id:contest_id, t_id:team_id})
    if (team_members_error) {
        console.error(team_members_error)
        fail(500, { team_members_error });
    }
    team_members = team_members_data;


    let { data:member_limit_data, error:member_limit_error } = await supabase.rpc('get_contest_member_limit', {c_id:contest_id})
    if (member_limit_error) {
        fail(500, { member_limit_error });
    }
    contest_member_limit = member_limit_data;


    return {
        props: {
            team_members,
            team_id,
            leader_id,
            contest_member_limit,
            error_message
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