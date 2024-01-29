import { error } from '@sveltejs/kit';
export const load = async ({url,fetch,params,locals}) => {
    // console.log(locals.user);
    const constest_id = params.contest_id
    const user_id = locals.user ? locals.user.id : 0

    let result = await locals.supabase.rpc('get_contest_status', {p_contest_id : params.contest_id})
    
    console.log(result.data);
    
    if( result.data == 'contest not found'){
        error(404, "Contest not found");
    }
    else
    {
        if(result.data == 'upcoming'){
            error(403, "Contest not started yet");
        }
       
       
    }

  
    
     const {data} = await locals.supabase
        .rpc('get_contest_challenge_list', {contest_id_param : constest_id, user_id_param : user_id})
    
    return {
        challenge_list: data
    };
}