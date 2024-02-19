import Database from './database'

async function check_submitted_flag(user_id,contest_id,challenge_id,team_id,flag){
    const query_1 = `
        INSERT INTO submissions (contest_id,user_id,problem_id,variation_id,team_id,verdict,flag)
        VALUES ($1,$2,$3,$4,$5,$6,$7);
    `;
    const query_2 = `
        SELECT EXISTS (SELECT flags 
        FROM contest_problems
        JOIN assigns_variation ON contest_problems.id = assigns_variation.problem_id
        JOIN problem_variations ON assigns_variation.variation_id = problem_variations.id 
        WHERE contest_problems.contest_id = $1 
        AND contest_problems.id = $2
        AND assigns_variation.team_id= $3
        AND $4 = ANY(problem_variations.flags));
    `;
    const query_3 = `
        SELECT variation_id
        from assigns_variation
        where team_id = $1 and problem_id = $2 and contest_id = $3;    
    `
    let variation_id = (await Database.run_query(query_3, [team_id,challenge_id,contest_id])).data[0].variation_id;
    const params_2 = [contest_id,challenge_id,team_id,flag];
    let result = await Database.run_query(query_2, params_2);
    
    const params_1 = [contest_id,user_id,challenge_id,variation_id,team_id,(result.data[0].exists)?"correct":"wrong",flag];
    let test = await Database.run_query(query_1, params_1);

    if(result.data[0].exists){
        // score will be added later
        const score = 100;
        const query_4 = `
            INSERT INTO solves (contest_id,user_id,problem_id,team_id,score) 
            VALUES ($1,$2,$3,$4,$5);
        `;
        const params_4 = [contest_id,user_id,challenge_id,team_id,score];
        let update_solve = await Database.run_query(query_4, params_4);
        console.log("update_solve");
        console.log(update_solve);
    }
    return result;
}

async function get_submissions_for_organizer(contest_id, team='', username='', problem='', category='') {
    let query = `
        select 
            s.id, s.user_id, s.team_id, s.verdict, s.flag, s.variation_id, s.time,
            u.username,
            t.name as team_name,
            cp.title, cp.category,
            pv.variation_name

        from contest_submissions s
        inner join users u on s.user_id = u.id
        inner join teams t on t.id = s.team_id
        inner join contest_problems cp on cp.id = s.problem_id
        inner join problem_variations pv on pv.id =  s.variation_id
        where s.contest_id = $1
        and t.name ilike '%' || $2 || '%'
        and u.username ilike '%' || $3 || '%'
        and cp.title ilike '%' || $4 || '%'
        and cp.category ilike '%' || $5 || '%'
        order by s.id desc
    `

    let params = [contest_id, team, username, problem, category]
    let result = await Database.run_query(query, params)
    return result
}


async function get_solves_for_organizer(contest_id, team='', username='', problem='', category='') {
    let query = `
        select 
            s.id, s.user_id, s.team_id, csub.flag, csub.variation_id, s.created_at as time,
            u.username,
            t.name as team_name,
            cp.title, cp.category,
            pv.variation_name

        from contest_solves s
        inner join users u on s.user_id = u.id
        inner join teams t on t.id = s.team_id
        inner join contest_problems cp on cp.id = s.problem_id
        inner join contest_submissions csub on csub.id = s.submission_id
        inner join problem_variations pv on pv.id =  csub.variation_id
        where s.contest_id = $1
        and t.name ilike '%' || $2 || '%'
        and u.username ilike '%' || $3 || '%'
        and cp.title ilike '%' || $4 || '%'
        and cp.category ilike '%' || $5 || '%'
        order by s.id desc
    `

    let params = [contest_id, team, username, problem, category]
    let result = await Database.run_query(query, params)
    return result
}


export default {
    check_submitted_flag,
    get_submissions_for_organizer,
    get_solves_for_organizer
}
