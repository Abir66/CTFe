import { error, redirect, type Actions, fail } from '@sveltejs/kit';
import standings from '$lib/server/database/contest_standings';
import clarifications from '$lib/server/database/contest_clarification';
import users from '$lib/server/database/users';
import contest from '$lib/server/database/contest';

export const load =  async (serverLoadEvent) => {
    const {fetch,locals,params} = serverLoadEvent;
    const contest_id = params.contest_id;
    const clarification_id = params.clarification_id;
    let result = await clarifications.get_clarification_chats(locals.user.id,contest_id,clarification_id);
    let thread_chat = [];
    let thread_details = null;
    if(result != null){
        thread_chat = result.data;
        result = await clarifications.get_clarification(locals.user.id,contest_id,clarification_id);
        thread_details = result.data;
    }
    
	return {
        thread_details: thread_details,
        thread_chat: thread_chat,
    }; 
}

export const actions: Actions = {
    sendQues: async ({ request,locals,params }) => {
        if(!locals.user){	
            throw redirect(301, '/auth/login');
        }
        let teams = await users.is_registered_to_contest(params.contest_id,locals.user.id);		
        if(teams.data.length==0){
            throw redirect(301, '/contests/'+params.contest_id+'/register');
        }
        const formdata = await request.formData();
        const chat_data = formdata.get('chat');
        let status = await clarifications.add_thread_chat(locals.user.id,params.contest_id,params.clarification_id,chat_data,null);
        console.log(status);
        if(status?.success){
            redirect(301, '/contests/'+params.contest_id+'/clarifications/'+params.clarification_id);
        }
        else{
            error(500, "No team found");
        }
    }
}
        