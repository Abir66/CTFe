import { error } from '@sveltejs/kit';


export const load = async ({params,locals}) => {
    const contest_id = params.contest_id;
	const response  = await locals.supabase
		.from('contests')
		.select('id, start_time, end_time, contest_name, memberlimit, type')
		.eq('id', contest_id)
    
    if(response.error){
        return error(500, "something went wrong");
    }

    if(response.data.length == 0){
        return error(404, "contest not found");
    }

    const data = {
        contest : response.data[0],
        user : locals.user
    }

    if(locals.user){
        const user_id = locals.user.id;

        const response = await locals.supabase
            .from('team_members')
            .select(`
                team_id,
                teams (leader_id, name)
            `)
            .eq('contest_id', contest_id)
            .eq('user_id', user_id)
        if(response.data != null && response.data.length != 0){
            data['team'] = {
                id : response.data[0].team_id,
                name : response.data[0].teams['name'],
                leader : user_id == response.data[0].teams['leader_id'],
            }
        }
    }

    return data
}