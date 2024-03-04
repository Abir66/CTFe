import { error } from '@sveltejs/kit';
import organizer from '$lib/server/database/organizer';
export const load = async ({url,params,locals}) => {
  

    const contest_id = params.contest_id;
   let res = await organizer.get_problems(contest_id);
 
    if(res.error){
        console.error(res.error);
        return error(500, "something went wrong");
    }
   
    return {
        problems: res.data
    };
}