import Database from './database';
async function get_specific_problem_variation(contest_id,problem_id,team_id) {

   console.log(team_id);
   
    const query = `
        SELECT cp.score, cp.max_attempts, cp.author_id, cp.category, cp.title, pv.description,u.username as author_name
        FROM contest_problems cp
        JOIN assigns_variation av ON cp.id = av.problem_id
        JOIN problem_variations pv ON av.variation_id = pv.id
        JOIN users u ON cp.author_id = u.id
        WHERE cp.contest_id = $1 AND cp.id = $2 AND av.team_id =$3;
    `;
    const params = [contest_id,problem_id,team_id];
    let result = await Database.run_query(query, params);
    const get_attempt_count = `
        SELECT attempt_count
        FROM team_attempts
        WHERE team_id = $2 AND contest_id = $1 AND problem_id = $3
    `
    let attempt_count = await Database.run_query(get_attempt_count, [contest_id,team_id,problem_id]);
    result.data[0].attempt_count = 0;
    if(attempt_count.data.length != 0){
        result.data[0].attempt_count = attempt_count.data[0].attempt_count;
    }
    return result;
}

async function get_any_problem_variation(contest_id,problem_id) {
    const query = `
    SELECT cp.score, cp.max_attempts, cp.author_id, cp.category, cp.title, pv.description, u.username as author_name , 0 as attempt_count
    FROM contest_problems cp
    JOIN problem_variations pv ON cp.id = pv.problem_id
    JOIN users u ON cp.author_id = u.id
    WHERE cp.contest_id = $1 AND cp.id = $2;
    `;
    const params = [contest_id,problem_id];
    let result = await Database.run_query(query, params);
    console.log(result);
    
    return result;
}

async function get_problem_status(contest_id,problem_id,team_id){
    const query = `
        SELECT exists(SELECT 1
        FROM solves
        WHERE team_id = $2 AND contest_id = $1 AND problem_id = $3)
    `
    const params = [contest_id,team_id,problem_id];
    let result = await Database.run_query(query, params);
    return result.data[0].exists;
}

export default 
{
    get_specific_problem_variation,
    get_any_problem_variation,
    get_problem_status
}