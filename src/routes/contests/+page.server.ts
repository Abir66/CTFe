

export const load = async ({url,fetch,params,locals: { supabase }}) => {


    let search_str = url.searchParams.get('search_str');
    let type = url.searchParams.get('type');
    let status = url.searchParams.get('status');

    // console.log(search_str, type, status);
   
    if(search_str == null)
    {
        search_str = "";
    }
    if(type == null || type == "")
    {
        type = "all";
    }
    if(status == null || status == "")
    {
        status = "all";
    }
    let { data, error } = await supabase.rpc('get_contests', {search_str: search_str, stat: status , typeof: type});
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