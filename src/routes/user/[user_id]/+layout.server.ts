import { error } from "@sveltejs/kit";

export const load = async ({params,locals}) => {

    const user_id = params.user_id;

    const response = await locals.supabase
        .from('users')
        .select('*')
        .eq('id', user_id);
    
   
    if(response.data.length==0)
    {
        
        error(404, "User not found");
    }
    else
    {
        return   response.data[0];
    }
   
    

}