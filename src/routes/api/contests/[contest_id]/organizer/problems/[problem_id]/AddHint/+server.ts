import {json} from '@sveltejs/kit'
import organizer from '$lib/server/database/organizer';

export async function POST({ locals,params,request}) {
   const data= await request.formData();
   console.log(data);
   
   const score = data.get('score');
   const name = data.get('description');
    console.log(score);
    console.log(name);
   let has_penalty;
   if(score==0 || score=='' || score=='0'){
       has_penalty = false;
    }
    else{
        has_penalty = true;
    }
    console.log(params.problem_id);
    
   const result = await organizer.Add_hint(params.problem_id, name, has_penalty, score);
    console.log(result);
    return json(result);


}