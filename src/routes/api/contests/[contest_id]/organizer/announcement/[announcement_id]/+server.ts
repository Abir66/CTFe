import {json} from '@sveltejs/kit'
import announcements from '$lib/server/database/contest_announcement';

export async function POST({ locals,params,request}) {

    if(!locals.user)  return json({error: "You must be logged in as a organizer to do it"});
    const response = await announcements.delete_announcement(params.announcement_id)
    console.log(response);
    return json(response)
}