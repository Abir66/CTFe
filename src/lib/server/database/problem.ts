import Database from './database';
async function get_specific_problem_variation(contest_id,problem_id,team_id) {

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
    // console.log(result);
    
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

async function get_problem_access(problem_id, user_id){
    const query = `SELECT get_problem_access($1, $2) as access;`;
    const params = [problem_id, user_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_problem(problem_id, user_id){
    const query = `SELECT get_problem($1, $2) as problem;`;
    const params = [problem_id, user_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function submit_flag(problem_id, user_id, flag, variation_id = -1){
    const query = `
        SELECT submit_flag($1, $2, $3, $4) as submit_response;
    `;
    const params = [problem_id, user_id, flag, variation_id];
    let result = await Database.run_query(query, params);
    return result;
}

// --------------------------
async function get_public_problem_list(search_str, categories){
    const query = `
        SELECT cp.id, cp.category, cp.title, c.contest_name, c.id as contest_id
        from contest_problems as cp
        left join contests c on c.id = cp.contest_id
        where c.type = 'public' and c.end_time < now()
            ${search_str ? "and (cp.title ilike '%' || $1 || '%')" : ''}
            ${(categories.length > 0 && search_str) ? `and (cp.category = ANY($2))` : ''}
            ${(categories.length > 0 && !search_str) ? `and (cp.category = ANY($1))` : ''}
        order by cp.id
    `
    let params: any[] = [];
    if(search_str) params.push(search_str);
    if(categories.length > 0){
        params.push(categories)
    }

    let result = await Database.run_query(query, params);
    return result;
}

async function get_public_problem(problem_id, variation_id){
    const query = `
    SELECT jsonb_build_object(
        'id', cp.id,
        'title', cp.title,
        'score', cp.score,
        'max_attempts', cp.max_attempts,
        'category', cp.category,
        'author_id', cp.author_id,
        'author_name', u.username,
        'description', v.description,
        'variation_id', v.id,
        'variation_name', v.variation_name,
        'attachments', (
            SELECT jsonb_agg(jsonb_build_object(
                'link', pa.link,
                'file_name', pa.file_name
            ))
            FROM problem_attachments pa
            WHERE pa.variation_id = v.id
        )
    ) as problem
    FROM contest_problems cp
    LEFT JOIN users u ON cp.author_id = u.id
    LEFT Join problem_variations v ON cp.id = v.problem_id
    WHERE cp.id = $1 ${variation_id ? `AND v.id = $2` : ''}
    ORDER BY v.id
    limit 1;   
    `;

    let params = [problem_id];
    if(variation_id) params.push(variation_id);
    const result = await Database.run_query(query, params);
    return result;
}


async function is_problem_publicly_available(problem_id){
    const query = `
    SELECT EXISTS (
        SELECT 1
        
        from contest_problems as cp
        left join contests c on c.id = cp.contest_id
        where c.type = 'public' and c.end_time < now() and cp.id = $1
    ) AS is_publicly_available;
    `
    let params = [problem_id]
    let result = await Database.run_query(query, params);
    return result;
}

async function get_all_hints(problem_id){
    const query = `select id, description from hints where problem_id = $1 order by id`
    let params = [problem_id]
    let result = await Database.run_query(query, params);
    return result;
}

async function get_variation_list(problem_id){
    const query = `select id, variation_name from problem_variations where problem_id = $1 order by id`
    let params = [problem_id]
    let result = await Database.run_query(query, params);
    return result;
}

async function upsolve_submit_flag(problem_id, variation_id, user_id, flag){
    
    const query = `SELECT upsolve_submit_flag($1, $2, $3, $4) as submit_response;`;
    const params = [problem_id, variation_id, user_id, flag,];
    const result = await Database.run_query(query, params);
    return result;
}

async function get_user_public_problem_submissions(user_id, problem_id){
    const query = 
    `
    SELECT us.id, us.time, us.problem_id, us.variation_id, us.verdict, us.flag, pv.variation_name
        FROM (
        SELECT id, time, problem_id, variation_id, verdict, flag from upsolving_submissions
        where user_id = $1 and problem_id = $2
        union

        SELECT id, time, problem_id, variation_id, verdict, flag from contest_submissions
        where user_id = $1 and problem_id = $2
        ) as us
        left join problem_variations pv on us.variation_id = pv.id
        order by time desc
    `
    const params = [user_id, problem_id];
    const result = await Database.run_query(query, params);
    return result;
}


export default 
{
    get_specific_problem_variation,
    get_any_problem_variation,
    get_problem_status,
    get_problem_access,
    get_problem,
    submit_flag,
    get_public_problem_list,
    get_public_problem,
    is_problem_publicly_available,
    get_all_hints,
    get_variation_list,
    upsolve_submit_flag,
    get_user_public_problem_submissions
}