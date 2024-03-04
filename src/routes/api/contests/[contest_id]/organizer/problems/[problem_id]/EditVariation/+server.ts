import {json} from '@sveltejs/kit'
import organizer from '$lib/server/database/organizer';

export async function POST({ locals,params,request}) {
    const data= await request.formData();
    const id = data.get('id');
    const description = data.get('description');
   const name = data.get('name');
   
    const result = await organizer.Edit_variation( id, name, description);
    //  console.log(result);
     return json(result);



}