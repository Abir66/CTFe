import { error, redirect, type Actions, fail } from '@sveltejs/kit';
import standings from '$lib/server/database/contest_standings';
import announcements from '$lib/server/database/contest_announcement';

export const load =  async (serverLoadEvent) => {
    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    let result = await announcements.get_announcements(contest_id);
	return {
        announcements: result.data,
        contest_id: contest_id
    }; 
}

export const actions: Actions = {
    postAnnouncement: async ({ request,locals,params }) => {
        if(!locals.user){	
            throw redirect(301, '/auth/login');
        }
        const formdata = await request.formData();
        const title = formdata.get('title');
        const description = formdata.get('description');
        let result = await announcements.add_announcement(params.contest_id,title,description,locals.user.id);
        console.log(result);
        // let status = await clarifications.add_thread_chat(locals.user.id,params.contest_id,params.clarification_id,chat_data,null);
        console.log(title,description);
    }
}