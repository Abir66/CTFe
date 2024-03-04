import {json} from '@sveltejs/kit'
import Users from '$lib/server/database/users'
import Contest from '$lib/server/database/contest.js'


export async function POST({ locals,params,request}) {
    if(!locals.user) {
        return json({success: false, message: "Not logged in"});
    }

    const user_id = locals.user.id;
    const data = await request.json();
    console.log("api endpoints");
    console.log(data);

    if(!data.contest_id || !data.invitee_id) {
        return json({success: false, message: "Invalid request"});
    }
    const member_id = data.invitee_id;
    const contest_id = data.contest_id;

    // need to check this
    // if(member_id != user_id) {
    //     const is_organizer = await Contest.is_organizer(contest_id, user_id);
    //     if(!is_organizer.success) return json({success: false, message: "Something went wrong"});
    //     if(!is_organizer.data[0].is_organizer) return json({success: false, message: "Access Denied"});
    // }
    
    const response = await Users.remove_organizer_invite(member_id, contest_id);
    if(response.error){
        console.log(response.error);
        return json({success: false, message: "Something went wrong"});
    }

    return json({success: true, message: "Invite removed successfully"});
}