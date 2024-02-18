import { error } from '@sveltejs/kit';
import Contest from '$lib/server/database/contest';
import contest_problems from '$lib/server/database/contest_problems.js';
export const load = async ({url,fetch,params,locals}) => {
    
    const contest_id = params.contest_id
    const user_id = locals.user ? locals.user.id : 0

    let contest_access = await Contest.get_contest_access(contest_id, user_id);
    if(!contest_access.success) return error(500, 'Something went wrong');

    contest_access = contest_access.data[0].access;


    let challenge_list_response;

    if(contest_access['access'] == 'organizer') {
        challenge_list_response = await contest_problems.get_problems_for_organizer(contest_id);
        
    }

    else if(contest_access['contest_status'] == 'none') {
       
        return error(403, 'Access Denied');
    }


    else if(contest_access['contest_status'] == 'upcoming') {
        // none
        return {
            challenge_list : [],
            contest_id
        };
    }

    else if(contest_access['contest_status'] == 'running' && contest_access['contest_paused'] == true) {
        // none
        return {
            challenge_list : [],
            contest_id
        };
    }


    else if(contest_access['access'] == 'viewer') {
        challenge_list_response = await contest_problems.get_problems_for_viewer(contest_id, contest_access['contest_status']);
    }

    else if(contest_access['access'] == 'participant') {
        const team_id = contest_access['team_id'];
        challenge_list_response = await contest_problems.get_problems_for_participant(contest_id, team_id, contest_access['contest_status']);
    }

    else if(contest_access['access'] == 'restricted') 
    {
        return error(403, 'Access Denied');
    }

    console.log(challenge_list_response);
        
    if(!challenge_list_response.success) return error(500, 'Something went wrong2');
    let challenge_list = challenge_list_response.data[0].json_agg;

    if (!challenge_list) challenge_list = []
    console.log(challenge_list);

    return {
        challenge_list,
        contest_id
    };
}