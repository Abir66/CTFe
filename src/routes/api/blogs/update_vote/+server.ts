import {json} from '@sveltejs/kit'
import Blogs from '$lib/server/database/blogs'


export async function POST({params,locals,request}){
    const data = await request.json();
    const response = await Blogs.update_vote(data.blog_id,locals.user.id,data.type,data.first);
    return json({status:"success",response:response})
}