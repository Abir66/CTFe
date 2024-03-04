import contest from '$lib/server/database/contest.js';
import Problem from '$lib/server/database/problem.js';
import { error } from '@sveltejs/kit';

export const load = async ({url,params,locals}) => {
    let search_str = url.searchParams.get('search_str');
    let category = url.searchParams.get('category');

    let category_list
    if(category) category_list = category.split(',');
    else category_list = [];


    const problem_response = await Problem.get_public_problem_list(search_str,category_list)
    
    if(!problem_response.success){
        console.log(problem_response.error);
        return error(500, 'Something went wrong');
    }


    return {
        problems: problem_response.data,
        search_str: search_str,
        category: category,
    };
}