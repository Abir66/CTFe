import { error } from '@sveltejs/kit';
import users from '$lib/server/database/users';
import problem from '$lib/server/database/problem';
export const load = async ({url,fetch,params,locals}) => {
    // console.log(locals.user);
    const contest_id = params.contest_id
    const user_id = locals.user ? locals.user.id : 0

    let result = await locals.supabase.rpc('get_contest_status', {p_contest_id : params.contest_id})
    
    // console.log(result.data);
    
    if( result.data == 'contest not found'){
        error(404, "Contest not found");
    }
    else
    {
        if(result.data == 'upcoming'){
            error(403, "Contest not started yet");
        }

    }

    
     let teams = await users.is_registered_to_contest(contest_id,user_id);
     let team_id = 0;
        if(teams.data.length != 0){
            team_id = teams.data[0].team_id;
        }
    
    //  const {data} = await locals.supabase
    //     .rpc('get_contest_challenge_list', {contest_id_param : contest_id, user_id_param : user_id})

    //     console.log(data);

    
     const data = await problem.get_all_problems_of_contest(contest_id,team_id);
    //  console.log(data);

        
    return {
        challenge_list: data,
        contest_id
    };
}