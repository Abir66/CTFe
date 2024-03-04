import Teams from '$lib/server/database/teams';
import { error } from '@sveltejs/kit';

export const load = async ({params, locals}) => {
	
    const team_id = params.team_id;

    let team_info_response = await Teams.get_team_info(team_id);
    if(team_info_response.data.length == 0){ error(404, "Team not found");}

    const is_leader = locals.user && locals.user.id == team_info_response.data[0].leader_id
    const contest_id = team_info_response.data[0].contest_id;
    
    
    let team_info = team_info_response.data[0];
    team_info_response = await Teams.get_team_members(team_id);
    let team_members = team_info_response.data;
    team_info_response = await Teams.get_team_member_score(team_id);
    let team_member_score = team_info_response.data;
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
    team_info_response = await Teams.get_solves(team_id);
    let team_solves = team_info_response.data;
    const category_solves = {};
    team_solves.forEach((solve) => {
        if(category_solves[solve.category] == undefined){
            category_solves[solve.category] = 1;
        }
        else{
            category_solves[solve.category]++;
        }
    });
    const verdict = {}
    team_info_response = await Teams.get_total_submission_count(team_id);
    verdict["Wrong"] = team_info_response.data[0].count- team_solves.length;
    verdict["Correct"] = team_solves.length;
    const categorySolves = {};
    Object.getOwnPropertySymbols(category_solves).forEach(symbol => {
    categorySolves[symbol.toString()] = category_solves[symbol];
    });


    // console.log(usersDict)
    const is_a_member = locals.user && team_members.find(member => member.user_id == locals.user.id);
    const is_member = is_a_member ? true : false;
    
    return {
        team_id: team_id,
        contest_id: contest_id,
        is_leader: is_leader,
        team_info: team_info,
        team_members: usersDict,
        team_solves: team_solves,
        category_solves: category_solves,
        verdict: verdict,
        is_member: is_member
    };


}