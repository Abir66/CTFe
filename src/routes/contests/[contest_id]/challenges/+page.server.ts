export const load = async ({url,fetch,params,locals}) => {
    const constest_id = params.contest_id
    const user_id = locals.user ? locals.user.id : 0

    const {data} = await locals.supabase
        .rpc('get_contest_challenge_list', {contest_id_param : constest_id, user_id_param : user_id})
    return {
        challenge_list: data,
        constest_id
    };
}