import { error, redirect, type Actions, fail } from '@sveltejs/kit';
import standings from '$lib/server/database/contest_standings';
import clarifications from '$lib/server/database/contest_clarification';
import users from '$lib/server/database/users';
import contest from '$lib/server/database/contest';

export const load =  async (serverLoadEvent) => {
    const {fetch,locals} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    let result = await contest.get_contest_details(contest_id);
	return {
        description: result.data[0].description,
        name: result.data[0].contest_name
    }; 
}

export const actions: Actions = {
    saveDescription: async ({ request,locals,params }) => {
        if(!locals.user){	
            throw redirect(301, '/auth/login');
        }
        const formdata = await request.formData();
        const title = formdata.get('title');
        const description = formdata.get('description');
        let result = await contest.update_contest_description(params.contest_id,description);
    }
}