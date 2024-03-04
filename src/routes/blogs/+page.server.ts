import Blogs from '$lib/server/database/blogs'
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({params,locals,url}) => {
    let search_str = url.searchParams.get('search_str');
    let search_time = url.searchParams.get('time');
    let search_vote = url.searchParams.get('vote')
    const blogs = await Blogs.get_blogs(search_str,search_time,search_vote);
    return { 
            user_id: locals.user.id,
            blogs: blogs.data
    }
};