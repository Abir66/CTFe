import { error, redirect, type Actions, fail } from '@sveltejs/kit';
import standings from '$lib/server/database/contest_standings';
import clarifications from '$lib/server/database/contest_clarification';
import users from '$lib/server/database/users';

export const load =  async (serverLoadEvent) => {
    const {fetch,locals} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    let result = await clarifications.get_clarifications(locals.user.id,contest_id);
	return {
        clarifications: result.data,
        contest_id: contest_id
    }; 
}

export const actions: Actions = {
	default: async ({ request,locals,params }) => {
        
		if(!locals.user){	
			throw redirect(301, '/auth/login');
		}
        let teams = await users.is_registered_to_contest(params.contest_id,locals.user.id);		
		if(teams.data.length==0){
			throw redirect(301, '/contests/'+params.contest_id+'/register');
		}
        const formdata = await request.formData();
        let status = await clarifications.add_clarification(locals.user.id,params.contest_id,formdata.get('title'));
        if(status){
            redirect(301, '/contests/'+params.contest_id+'/clarifications');
        }
        else{
            error(500, "No team found");
        }
	  
	}
};