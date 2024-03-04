import { error } from "@sveltejs/kit";
import user from '$lib/server/database/users.js';

export const load = async ({params,locals}) => {

    const user_id = params.user_id;
    const contest_count = await user.Number_of_contest_user_Participated_in(user_id);
   
    const contest_organized = await user.Number_of_contest_user_Organized(user_id);
    const solved_stat_category= await user.user_problem_stat_categorywise(user_id);
    const problem_count = await user.Number_of_problem_user_solved(user_id);
    const blogs_count = await user.Number_of_blogs_user_wrote(user_id);
    return {
        contest_count: contest_count.data[0].contest_count,
        contest_organized: contest_organized.data[0].contest_organized,
        solved_stat_category: solved_stat_category.data,
        problem_count: problem_count.data[0].count,
        blogs_count: blogs_count.data[0].count
    }

}