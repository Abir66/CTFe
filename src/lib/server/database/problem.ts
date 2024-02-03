import Database from './database';
async function get_specific_problem_variation(contest_id,problem_id,team_id) {

   
    const query = `
    SELECT cp.score, cp.max_attempts, cp.author_id, cp.category, cp.title, pv.description,u.username as author_name, t.attempt_count,
    FROM contest_problems cp
    JOIN assigns_variation av ON cp.id = av.problem_id
    JOIN problem_variations pv ON av.variation_id = pv.id
    JOIN users u ON cp.author_id = u.id
    JOIN team_attempts t ON av.team_id = t.team_id 
    WHERE cp.contest_id = $1 AND cp.id = $2 AND av.team_id = $3;
    `;
    const params = [contest_id,problem_id,team_id];
    let result = await Database.run_query(query, params);
   
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

export default 
{
    get_specific_problem_variation,
    get_any_problem_variation
}