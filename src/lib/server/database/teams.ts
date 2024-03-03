import Database from './database'

async function get_team_info(team_id){
    const query = `
    SELECT name,contest_id,leader_id,allow_join_via_password, status from teams where teams.id = $1
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

async function get_leader_id(team_id){
    const query = `
        select leader_id, contest_id from teams
        where id = $1
    `
    const params = [team_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function set_password(team_id, password){
    const query = `
        update teams
        set team_password = $2
        where id = $1
    `
    const params = [team_id, password];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_team_password_status(team_id){

    const query = `
        select leader_id, case when team_password is null then false else true end as password_set from teams
        where id = $1
    `

    const params = [team_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function set_allow_join_via_password(team_id, allow){
    const query = `
        update teams
        set allow_join_via_password = $2
        where id = $1
    `
    const params = [team_id, allow];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_team_id(user_id,contest_id){
    const query = `
        select team_id from team_members
        where user_id = $1
        and contest_id = $2
    `
    const params = [user_id,contest_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function delete_team(team_id){
    const query = `
        delete from teams
        where id = $1
    `
    const params = [team_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function remove_member(team_id, member_id){
    const query = `
        delete from team_members
        where team_id = $1
        and user_id = $2
    `
    const params = [team_id, member_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_invited_members(team_id){
    const query = `
        select ti.invitee_id, u.username
        from team_invites ti join users u on ti.invitee_id = u.id
        where team_id = $1
    `
    const params = [team_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function remove_invite(team_id, member_id){
    const query = `
        delete from team_invites
        where team_id = $1
        and invitee_id = $2
    `
    const params = [team_id, member_id];
    let result = await Database.run_query(query, params);
    return result;
}


async function get_team_invites(user_id){
    const query = `
        SELECT 
            inviter.id AS inviter_id, 
            inviter.username AS inviter_username, 
            invitee.id AS invitee_id, 
            invitee.username AS invitee_username,
            ti.team_id,
            t.name AS team_name,
            t.contest_id,
            c.contest_name AS contest_name,
            ti.created_at as invite_time
        FROM 
            team_invites ti
        JOIN
            teams t ON ti.team_id = t.id
        JOIN
            contests c ON c.id = t.contest_id
        JOIN 
            users inviter ON ti.inviter_id = inviter.id
        JOIN 
            users invitee ON ti.invitee_id = invitee.id
        WHERE 
            invitee_id = $1
        ORDER BY 
            ti.created_at DESC;
    `
    const params = [user_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function set_team_status(team_id, status){
    const query = `
        update teams
        set status = $2
        where id = $1
    `
    const params = [team_id, status];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_user_team_info(user_id, contest_id){
    const query = `
        select tm.team_id, tm.contest_id, t.name as team_name
        from team_members tm
        left join teams t on tm.team_id = t.id and tm.contest_id = t.contest_id
        where tm.user_id = $1 and tm.contest_id = $2
    `
    const params = [user_id, contest_id];
    let result = await Database.run_query(query, params);
    return result;
}


export default {
    get_team_info,
    get_team_members,
    get_team_member_score,
    get_solves,
    get_total_submission_count,
    get_member_limit,
    get_leader_id,
    set_password,
    get_team_password_status,
    set_allow_join_via_password,
    get_team_id,
    delete_team,
    remove_member,
    get_invited_members,
    remove_invite,
    get_team_invites,
    set_team_status,
    get_user_team_info
}
