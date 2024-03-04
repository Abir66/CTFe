import {json} from '@sveltejs/kit'
import organizer from '$lib/server/database/organizer';

export async function POST({ locals,params,request}) {
   const data= await request.formData();
    const id = data.get('id');
    console.log(id);
    
   const result = await organizer.delete_hint_by_id(id);
    console.log(result);
    return json(result);


}