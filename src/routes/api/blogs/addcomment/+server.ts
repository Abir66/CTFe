import {json} from '@sveltejs/kit'
import Blogs from '$lib/server/database/blogs'

export async function POST({locals,params,request}) {
    const data = await request.json();
    const user_id = locals.user.id;
    const blog_id = data.blog_id;
    const content = data.content;
    
    const response = await Blogs.add_comment(user_id,blog_id,content);
    return json({status:'success',response:response});
}