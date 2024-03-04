import {json} from '@sveltejs/kit'
import organizer from '$lib/server/database/organizer';

export async function POST({ locals,params,request}) {
   const data= await request.formData();
    const id = data.get('id');
    
     let res = await organizer.Remove_attachment( id);
    return json(res);

}