import Contest from '$lib/server/database/teams';
import { error } from '@sveltejs/kit';

export const load = async ({params, locals}) => {
	
    const team_id = params.team_id;
    let result = await Contest.get_team_info(team_id);
    if(result.data.length == 0){
        error(404, "Team not found");
    }
    let team_info = result.data[0];
    result = await Contest.get_team_members(team_id);
    let team_members = result.data;
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
    result = await Contest.get_solves(team_id);
    let team_solves = result.data;
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
    result = await Contest.get_total_submission_count(team_id);
    verdict["Wrong"] = result.data[0].count- team_solves.length;
    verdict["Correct"] = team_solves.length;
    const categorySolves = {};
    Object.getOwnPropertySymbols(category_solves).forEach(symbol => {
    categorySolves[symbol.toString()] = category_solves[symbol];
    });
    return {
        team_info: team_info,
        team_members: usersDict,
        team_solves: team_solves,
        category_solves: category_solves,
        verdict: verdict
    };
    
    return null;

}