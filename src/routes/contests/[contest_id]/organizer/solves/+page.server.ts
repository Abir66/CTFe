import { error } from '@sveltejs/kit';
import ContestSubmissions from '$lib/server/database/contest_submission.js';
export const load = async ({url,fetch,params,locals}) => {

    let search_team_name = url.searchParams.get('search_team_name')
    let search_username = url.searchParams.get('search_username')
    let search_problem_name = url.searchParams.get('search_problem_name')
    let category = url.searchParams.get('category')

    if(search_team_name === null) search_team_name = '';
    if(search_username === null) search_username = '';
    if(search_problem_name === null) search_problem_name = '';
    if(category === null || category==='any') category = '';

    let has_params = false;
    if(search_team_name !== '' || search_username !== '' || search_problem_name !== '' || category !== ''){
        has_params = true;
    }


    const contest_id = params.contest_id
    const submissions = await ContestSubmissions.get_solves_for_organizer(contest_id, search_team_name, search_username, search_problem_name, category);
    if(!submissions.success){
        console.log(submissions.error);
        return error(500, 'Something went wrong');
    }

    // console.log(submissions.data);

    return {
        submissions : submissions.data,
        contest_id,
        has_params,
    };
}