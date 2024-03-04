import {json} from '@sveltejs/kit'
import Contest from '$lib/server/database/contest.js';

export async function POST({ locals,params,request}) {
   
    if(!locals.user) {
        return json({success: false, message: "Not logged in"});
    }

    const data = await request.json();

    if(!data.contest_id) return json({success: false, message: "Invalid request"});
    
    const contest_id = data.contest_id;
    const user_id = locals.user.id;

    const is_organizer_invite_valid = await Contest.organizer_invite_validity(user_id, contest_id);
    if(!is_organizer_invite_valid.success) return json({success: false, message: "Something went wrong"});
    if(!is_organizer_invite_valid.data[0].organizer_invite_validity) return json({success: false, message: "Not valid"});    
    

    const eligibility_response = await Contest.get_registration_eligibility(contest_id, user_id)
    if(!eligibility_response.success) return json({success: false, message: "Something went wrong"});
    
    const eligibility = eligibility_response.data[0].registration_eligibility.status;
    
    if(eligibility != "eligible") return json({success: false, message: "Not eligible to accept the invite."});
    

    const add_organizer_response = await Contest.add_organizer(user_id, contest_id);
    if(!add_organizer_response.success) return json({success: false, message: "Something went wrong"});
    return json({success: true, message: "Invite accepted successfully"});
}