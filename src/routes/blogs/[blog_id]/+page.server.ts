import Blogs from '$lib/server/database/blogs'
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({params,locals}) => {
	
    const blog_id = params.blog_id;
    const blog = await Blogs.get_blog(blog_id,locals.user.id);
    return { 
            user_id: locals.user.id,
            blog_id: params.blog_id,
            blog: blog.data[0],
            username: locals.user.username
    }
};