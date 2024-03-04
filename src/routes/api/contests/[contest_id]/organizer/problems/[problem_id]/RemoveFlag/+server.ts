import {json} from '@sveltejs/kit'
import organizer from '$lib/server/database/organizer';

export async function POST({ locals,params,request}) {
   const data= await request.formData();
    const id = data.get('id');
    const flag = data.get('flagsofVariation');
     let res = await organizer.Remove_flag( id, flag);
    return json(res);

}