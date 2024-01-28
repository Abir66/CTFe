

export const load = async ({url,fetch,params,locals: { supabase }}) => {
    let { data, error } = await supabase.rpc('get_contests');
//     console.log(supabase);
//    console.log(data[0].start_time);

    if (error) {
        console.error(error);
        return {
            status: 500,
            body: error,
            contest_list: []
        };
    }
  
    return {
       
        contest_list:data
        
    };
}