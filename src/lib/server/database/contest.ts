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
        SELECT id, description, start_time, end_time, type, memberlimit, contest_name, format, registration_paused
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

async function get_contest_access(contest_id, user_id) {
    const query = `SELECT get_contest_access($1, $2) as access;`;
    const params = [contest_id, user_id];
    let result = await Database.run_query(query, params);
    return result;
}

export default {
    get_contest_list,
    get_contest_details,
    get_contest_organizers,
    get_contest_teams_shortlist,
    get_registration_eligibility,
    get_contest_type,
    get_contest_access
}

