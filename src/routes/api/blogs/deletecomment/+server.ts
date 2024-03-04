import {json} from '@sveltejs/kit'
import Blogs from '$lib/server/database/blogs'

export async function POST({request,params,locals}) {
    const data = await request.json();
    const response = await Blogs.delete_comment(data.blog_id,locals.user.id,data.comment_id);
    return json({status: "success",response: response})
}