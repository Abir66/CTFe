import contest from '$lib/server/database/contest.js';
import Problem from '$lib/server/database/problem.js';
import { error } from '@sveltejs/kit';

export const load = async ({url,params,locals}) => {
    const problem_id = params.problem_id;

    // check if publicly available
    const is_publicly_available = await Problem.is_problem_publicly_available(problem_id);
    
    if(!is_publicly_available.success){
        console.log(is_publicly_available.error);
        return error(500, 'Something went wrong');
    }
    
    if(!is_publicly_available.data[0].is_publicly_available) return error(404, 'Not Found');
    
    let variation_id = url.searchParams.get('variation_id');

    const problem_response = await Problem.get_public_problem(problem_id, variation_id)
    if(!problem_response.success){
        console.log(problem_response.error);
        return error(500, 'Something went wrong');
    }

    if(problem_response.data.length < 1) return error(404, 'Not Found');

    const hints_response = await Problem.get_all_hints(problem_id);
    if(!hints_response.success){
        console.log(hints_response.error);
        return error(500, 'Something went wrong');
    }


    const variations = await Problem.get_variation_list(problem_id);

    if(!variations.success){
        console.log(variations.error);
        return error(500, 'Something went wrong');
    }

    let user_submissions
    if(locals.user){

        user_submissions = await Problem.get_user_public_problem_submissions(locals.user.id, problem_id)
        if(!user_submissions.success){
            console.log(user_submissions.error);
            return error(500, 'Something went wrong');
        }
        user_submissions = user_submissions.data;

        user_submissions = user_submissions.map(submission => {
            submission.time = formatTime(submission.time);
            return submission;
        });
    }


    return {
        problem: problem_response.data[0].problem,
        hints : hints_response.data,
        variations: variations.data,
        user_submissions: user_submissions,
    };

}

function formatTime(inputTimeString) {
    // Parse the input time string into a datetime object
    const utcTime = new Date(inputTimeString);

    // Create a new Date object with Bangladesh time zone (GMT+6)
    const bdTime = utcTime;

    // Format the date according to the desired format
    return bdTime.toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }) + " " + bdTime.toLocaleTimeString("en-BD", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });
}