import {json} from '@sveltejs/kit'
import Blogs from '$lib/server/database/blogs'

export async function POST({locals,params,request}) {
    const data = await request.json();
    const user_id = locals.user.id;
    const title = data.title;
    if(title == undefined || title.length == 0) return json({status: "error", error: "Title is required"});
    const contents = data.contents;
    const response = await Blogs.edit_blog(data.blog_id,title,user_id,contents);
    let status;
    if(response.data[0].return_status != "success") status = "error";
    else if (response.error) status = "error";
    else status = "success";
    return json({status: status,response: response})
}


