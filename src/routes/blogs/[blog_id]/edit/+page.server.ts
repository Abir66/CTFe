import {  message, superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import Blogs from '$lib/server/database/blogs'

import type { Actions, PageServerLoad } from './$types';


export const load: PageServerLoad = async ({locals,params}) => {
    	
    const response = await Blogs.get_blog(params.blog_id,locals.user.id);

    return { 
        blog_id: 1,
        blog_info: response.data[0].blog.blog_info,
        blog_content: response.data[0].blog.blog_content,
    };
};

