import Database from './database'

async function get_team_info(team_id){
    const query = `
    SELECT name,contest_id,leader_id from teams where teams.id = $1
    `;
    const params = [team_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_team_members(team_id){
    const query = `
        select team_members.user_id,users.username from team_members
        join users on users.id = team_members.user_id
        where team_id = $1
    `;
    const params = [team_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_team_member_score(team_id){
    const query = `
        select user_id,sum(contest_problems.score)
        from contest_solves
        join contest_problems on contest_solves.contest_id =contest_problems.contest_id
        where contest_solves.team_id = $1
        and contest_solves.problem_id = contest_problems.id
        group by user_id
    `
    const params = [team_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_solves(team_id){
    const query = `
        select users.username, contest_problems.id, contest_problems.title, contest_problems.category from contest_solves
        join users on users.id = contest_solves.user_id
        join contest_problems on contest_problems.id = contest_solves.problem_id
        where contest_solves.team_id = $1
    `
    const params = [team_id];
    let result = await Database.run_query(query, params);
    return result;

}

async function get_total_submission_count(team_id){
    const query = `
        select count(*) from contest_submissions
        where team_id = $1
    `
    const params = [team_id];
    let result = await Database.run_query(query, params);
    return result;

}

async function get_member_limit(contest_id){
    const query = `
        select memberlimit from contests
        where id = $1
    `
    const params = [contest_id];
    let result = await Database.run_query(query, params);
    return result;
}




export default {
    get_team_info,
    get_team_members,
    get_team_member_score,
    get_solves,
    get_total_submission_count,
    get_member_limit
}
