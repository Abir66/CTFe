import Database from './database';


async function get_contest_list(search_str, type, status) {
    if(!type) type = "all";
    if(!status) status = "all";
    if(!search_str) search_str = "";
    
    let query = `
            SELECT 
                contests.id,
                contests.contest_name,
                contests.start_time,
                contests.type,
                EXTRACT(EPOCH FROM (contests.end_time - contests.start_time)) AS duration,
                
                CASE
                    WHEN contests.start_time > NOW() THEN 'upcoming'
                    WHEN contests.start_time <= NOW() AND contests.end_time >= NOW() THEN 'running'
                    ELSE 'finished'
                END AS status
                
            FROM contests
    `;

    let params: String[] = [];

    if (search_str != "") {
        query += "\nWHERE contests.contest_name ILIKE ('%' || $1 || '%') ";
        params.push(search_str);
    }

    if (type != "all" && type) {
        params.length == 0 ? query += "\nWHERE\t" : query += "\nAND\t";
        params.push(type);
        query += "contests.type = $" + params.length;
    }

    if (status == "upcoming" || status == "running" || status == "finished") {
        params.length == 0 ? query += "\nWHERE\t" : query += "\nAND\t";
        if (status == "upcoming") query += "\ncontests.start_time > NOW()";
        else if (status == "running") query += "\ncontests.start_time <= NOW() AND contests.end_time >= NOW()";
        else if (status == "finished") query += "\ncontests.start_time <= NOW() AND contests.end_time < NOW()";
    }

    query += "\nORDER BY contests.start_time DESC;";

    let result = await Database.run_query(query, params);
    return result;
}


async function get_contest_details(contest_id) {
    const query = `
        SELECT id, description, start_time, end_time, type, memberlimit, contest_name, format, registration_paused,created_by, contest_password
        FROM contests
        WHERE id = $1;
    `;
    const params = [contest_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_contest_organizers(contest_id) {
    const query = `
        SELECT id, username
        FROM users
        WHERE id IN (
            SELECT user_id
            FROM organizers
            WHERE contest_id = $1
        );
    `;

    const params = [contest_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_contest_teams_shortlist(contest_id){

    const query = `
        SELECT id, name, COUNT(*) OVER () AS total_teams
        FROM teams
        WHERE contest_id = $1
        LIMIT 4;
    `;

    const params = [contest_id];
    const result = await Database.run_query(query, params);
    return result;
}


async function get_registration_eligibility(contest_id, user_id){
    const query = `
        SELECT registration_eligibility($1, $2);
    `;

    const params = [contest_id, user_id];
    const result = await Database.run_query(query, params);
    return result;
}

async function get_contest_type(contest_id) {
    const query = `
        SELECT type
        FROM contests
        WHERE id = $1;
    `;
    const params = [contest_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_contest_status(contest_id) {
    const query = `
        SELECT get_contest_status2($1) as status;
    `;

    const params = [contest_id];
    const result = await Database.run_query(query, params);
    return result;

}


async function get_contest_access(contest_id, user_id) {
    const query = `SELECT get_contest_access($1, $2) as access;`;
    const params = [contest_id, user_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_contest_layout_data(contest_id, user_id) {
    const query = `
        SELECT get_contest_layout_data($1, $2) as layout_data;
    `;

    const params = [contest_id, user_id];
    const result = await Database.run_query(query, params);
    return result;
}

async function get_private_contest_access(contest_id, user_id, password) {
    const query = ` SELECT get_private_contest_access($1, $2, $3) as access;`;
    const params = [contest_id, user_id, password];
    const result = await Database.run_query(query, params);
    return result;
}

async function get_participant_list(contest_id, username=''){
    let query = `
    SELECT 
        tm.team_id,
        tm.user_id,
        u.username,
        t.name AS team_name,
        COALESCE(SUM(cp.score), 0) AS total_score,
        COALESCE(COUNT(cs.problem_id), 0) AS solve_count
    FROM 
        team_members tm
    INNER JOIN 
        users u ON tm.user_id = u.id
    INNER JOIN 
        teams t ON tm.team_id = t.id
    LEFT JOIN 
        contest_solves cs ON tm.user_id = cs.user_id AND tm.contest_id = cs.contest_id
    LEFT JOIN 
        contest_problems cp ON cs.problem_id = cp.id AND tm.contest_id = cp.contest_id
    WHERE 
        tm.contest_id = $1 ${username!=''  ? "AND u.username ILIKE '%' || $2 || '%'" : ""}
    GROUP BY 
        tm.team_id, tm.user_id, u.username, t.name
    ORDER by
        LOWER(username)
    `;
    let params = [contest_id];
    if(username!='') params.push(username);
    const result = await Database.run_query(query, params);
    return result;
}

async function get_team_list(contest_id, team_name=''){
    let query = `
        SELECT 
            t.id,
            t.name,
            t.status,
            t.created_at as registered_at,
            COUNT(DISTINCT tm.user_id) AS member_count
        FROM 
            teams t
        LEFT JOIN 
            team_members tm ON t.id = tm.team_id
        WHERE 
            t.contest_id = $1 ${team_name!=''  ? "AND t.name ILIKE '%' || $2 || '%'" : ""}
        GROUP BY 
            t.id, t.name, t.status, t.created_at
        ORDER BY
            LOWER(t.name)
        `
    let params = [contest_id];
    if(team_name!='') params.push(team_name);
    const result = await Database.run_query(query, params);
    return result;
}

async function update_contest_description(contest_id, description){
    let query = `
        UPDATE contests
        SET description = $2
        WHERE id = $1
    `;
    let params = [contest_id, description];
    const result = await Database.run_query(query, params);
    return result;
}

async function get_banned_users(contest_id, search_user_name){

    const query = `
        SELECT bt.user_id, u.username
        FROM banned_users bt
        LEFT JOIN team_members tm ON bt.user_id = tm.user_id and bt.contest_id = tm.contest_id
        LEFT JOIN users u ON bt.user_id = u.id
        WHERE bt.contest_id = $1 ${search_user_name!=''  ? "AND u.username ILIKE '%' || $2 || '%'" : ""}
        AND tm.team_id IS NULL
        ORDER BY LOWER(u.username)
    `;

    let params = [contest_id];
    if(search_user_name!='') params.push(search_user_name);
    const result = await Database.run_query(query, params);
    return result;
}

async function remove_user_ban(user_id, contest_id){
    const query = `
        DELETE FROM banned_users
        WHERE contest_id = $2 AND user_id = $1;
    `;
    const params = [user_id, contest_id];
    const result = await Database.run_query(query, params);
    return result;
}

async function is_organizer(user_id, contest_id){
    const query = `
        SELECT EXISTS(
            SELECT 1
            FROM organizers
            WHERE user_id = $1 AND contest_id = $2
        ) as is_organizer;
    `;
    const params = [user_id, contest_id];
    const result = await Database.run_query(query, params);
    return result;
}

async function organizer_invite_validity(user_id, contest_id){
    const query = `
        SELECT EXISTS(
            SELECT 1
            FROM organizer_invites
            WHERE invitee_id = $1 AND contest_id = $2
        ) as organizer_invite_validity;
    `;
    const params = [user_id, contest_id];
    const result = await Database.run_query(query, params);
    return result;
}

async function add_organizer(user_id, contest_id){
    const query = `
        INSERT INTO organizers (user_id, contest_id)
        VALUES ($1, $2);
    `;
    const params = [user_id, contest_id];
    const result = await Database.run_query(query, params);
    return result;
}
    


export default {
    get_contest_list,
    get_contest_details,
    get_contest_organizers,
    get_contest_teams_shortlist,
    get_registration_eligibility,
    get_contest_type,
    get_contest_access,
    get_contest_layout_data,
    get_private_contest_access,
    get_participant_list,
    get_team_list,
    update_contest_description,
    get_contest_status,
    get_banned_users,
    remove_user_ban,
    is_organizer,
    organizer_invite_validity,
    add_organizer
}

