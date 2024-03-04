import {json} from '@sveltejs/kit'
import organizer from '$lib/server/database/organizer';

export async function POST({ locals,params,request}) {
    const data= await request.formData();
    const id = data.get('id');
    const dependent_id = data.get('dependent_id');
    
   const result = await organizer.Remove_requirement( dependent_id, id);
    // console.log(result);
    
    return json(result);




}