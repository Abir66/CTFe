import Database from './database';

async function does_user_have_team(user_id: number, contest_id: number) {

    const query = `SELECT team_id FROM team_members WHERE user_id = $1 AND contest_id = $2`;
    const params = [user_id, contest_id];
    const result = await Database.run_query(query, params);
    return result;
}

async function create_team(user_id, contest_id, team_name, contest_password) {
    const query = `SELECT create_team($1, $2, $3, $4) as RESULT`;
    const params = [user_id, contest_id, team_name, contest_password];
    const result = await Database.run_query(query, params);
    return result;
}

async function join_team_via_password(user_id, contest_id, team_name, password) {
    const query = `SELECT join_team_via_password($1, $2, $3, $4) as RESULT`;
    const params = [user_id, contest_id, team_name, password];
    const result = await Database.run_query(query, params);
    return result;
}

async function join_team_via_invite(user_id, team_id){
    const query = `SELECT join_team_via_invite($1, $2) as RESULT`;
    const params = [user_id, team_id];
    const result = await Database.run_query(query, params);
    return result;
}


export default {
    does_user_have_team,
    create_team,
    join_team_via_password,
    join_team_via_invite
}
