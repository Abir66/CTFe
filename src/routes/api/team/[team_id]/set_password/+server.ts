import {json} from '@sveltejs/kit'
import Teams from '$lib/server/database/teams'


export async function POST({ locals,params,request}) {
   
    if(!locals.user) {
        return json({success: false, message: "Not logged in"});
    }

    const team_id = params.team_id;
    const formData = await request.formData()
    const password = formData.get('password') as string;    
    const user_id = locals.user.id;
    console.log(password);

    if(!password) {
        return json({success: false, message: "Password not provided"});
    }

    // Minimum length check
    if (password.length < 8) {
        return json({success: false, message: "Password must be at least 8 characters long"});
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);

    if (!hasUppercase || !hasLowercase || !hasDigit) {
        return json({success: false, message: "Password must contain at least one uppercase letter, one lowercase letter and one digit"});
    }


    // check leader access
    const leader_id_response = await Teams.get_leader_id(team_id);

    if(leader_id_response.error) return json({success: false, message: "Something went wrong"});
    if(leader_id_response.data.length == 0) return json({success: false, message: "Team not found"});
    if(leader_id_response.data[0].leader_id != user_id) return json({success: false, message: "You are not the leader of this team"});
    

    // set password
    const response = await Teams.set_password(team_id, password);
    if(response.error) return json({success: false, message: "Something went wrong"});
    

    return json({success: true, message: "Password set successfully"});
}