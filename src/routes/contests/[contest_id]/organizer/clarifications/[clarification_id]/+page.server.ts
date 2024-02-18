import { error, redirect, type Actions, fail } from '@sveltejs/kit';
import clarifications from '$lib/server/database/contest_clarification';

export const load =  async (serverLoadEvent) => {
    const {fetch,locals,params} = serverLoadEvent;
    const contest_id = params.contest_id;
    const clarification_id = params.clarification_id;
    let result = await clarifications.get_clarification_chats_organizer(locals.user.id,contest_id,clarification_id);
    let thread_chat = [];
    let thread_details = null;
    if(result != null){
        thread_chat = result.data;
        result = await clarifications.get_clarification_organizer(contest_id,clarification_id);
        thread_details = result.data;
    }
    
	return {
        thread_details: thread_details,
        thread_chat: thread_chat,
    }; 
}

export const actions: Actions = {
    sendClarify: async ({ request,locals,params }) => {
        if(!locals.user){	
            throw redirect(301, '/auth/login');
        }
        const formdata = await request.formData();
        const chat_data = formdata.get('chat');
        let status = await clarifications.add_thread_chat_organizer(locals.user.id,params.contest_id,params.clarification_id,chat_data,null);
        if(status?.success){
            status = await clarifications.update_organizer_seen(params.clarification_id);
            redirect(301, '/contests/'+params.contest_id+'/organizer/clarifications/'+params.clarification_id);
        }
        else{
            error(500, "There was an error");
        }
    }
}