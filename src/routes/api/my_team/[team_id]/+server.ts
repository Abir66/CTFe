import Contest from '$lib/server/database/teams';
import contest_clarification from '$lib/server/database/contest_clarification';
import { error } from '@sveltejs/kit';
import {json} from '@sveltejs/kit'


export async function GET({ locals,params }) {
    const { challenge_id } = params
    let user_id = locals.user ? locals.user.id : 0
    console.log("here i am in api team server.js");
    console.log(params);
    const contest_id = params.team_id;
    let result = await contest_clarification.get_team_id(locals.user.id,contest_id);
    if(result.data.length == 0){
        error(404, "Team not found");
    }
    const team_id = result.data[0].id;
    result = await Contest.get_team_info(team_id);
    if(result.data.length == 0){
        error(404, "Team not found");
    }
    console.log(result.data);
    let team_info = result.data[0];
    result = await Contest.get_team_members(team_id);
    let team_members = result.data;
    console.log(team_members);
    result = await Contest.get_team_member_score(team_id);
    let team_member_score = result.data;
    const usersDict = {};
    team_members.forEach((member) => {
        if(member.user_id == team_info.leader_id)
            usersDict[member.user_id] = {id:member.user_id, name: member.username, score: 0,leader:1};
        else
            usersDict[member.user_id] = {id:member.user_id, name: member.username, score: 0,leader:0};
    });
    team_member_score.forEach((member) => {
        usersDict[member.user_id].score = member.sum;
    });

    return json({ success: true, data: usersDict })

}