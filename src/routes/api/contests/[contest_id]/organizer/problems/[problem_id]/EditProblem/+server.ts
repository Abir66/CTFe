import {json} from '@sveltejs/kit'
import organizer from '$lib/server/database/organizer';

export async function POST({ locals,params,request}) {
   const data= await request.formData();
   
    const problem_id = params.problem_id;
    const title = data.get('title');
    const points = data.get('points');
    const maxAttempts = data.get('maxAttempt');
    const category = data.get('category');
    const result = await organizer.Editproblem(problem_id, title, points, maxAttempts, category);
    console.log(result);
    return json(result);


}