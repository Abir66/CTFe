import {json} from '@sveltejs/kit'
import Blogs from '$lib/server/database/blogs'

export async function POST({request,params,locals}) {
    const data = await request.json();
    const response = await Blogs.delete_blog(data.blog_id,locals.user.id);
    return json({status: "success",response: {blog_id: data.blog_id}})
}