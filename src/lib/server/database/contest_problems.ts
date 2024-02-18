import contest from './contest';
import Database from './database';

async function get_hints(challenge_id, user_id){
    const query = `SELECT get_hints($1, $2) as hints;`;
    const params = [challenge_id, user_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function unlock_hint(hint_id, user_id){
    const query = `SELECT unlock_hint($1, $2) as hint;`;
    const params = [hint_id, user_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_problems_for_organizer(contest_id){
    const query = `
        SELECT 
            json_agg(json_build_object(
                'category', category,
                'challenges', challenges
            ))
        FROM (
            SELECT 
                category, 
                json_agg(json_build_object(
                    'id', id,
                    'title', title,
                    'score', score
                )) AS challenges
            FROM contest_problems
            WHERE contest_id = $1
            GROUP BY category
        ) subquery;
    `;

    const params = [contest_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_problems_for_viewer(contest_id, contest_status='finished'){
    
    const prerequisites_query = `
        LEFT join contest_problem_prerequisites p ON cp.id = p.dependent
        WHERE p.dependent IS NULL\n
    `;
    
    const query = `
        SELECT 
            json_agg(json_build_object(
                'category', category,
                'challenges', challenges
            ))
        FROM (
            SELECT 
                cp.category, 
                json_agg(json_build_object(
                    'id', cp.id,
                    'title', cp.title,
                    'score', cp.score
                )) AS challenges
            FROM (
                SELECT id, category, title, score
                FROM contest_problems
                WHERE contest_id = $1
                AND (problem_hidden = false OR problem_hidden IS NULL)
                ORDER BY id
            ) cp 
        ${contest_status != 'finished' ? prerequisites_query : ''}
        GROUP BY cp.category
        ) subquery;
    `;

    const params = [contest_id];
    let result = await Database.run_query(query, params);
    return result;
}


async function get_problems_for_participant(contest_id, team_id, contest_status='finished'){
    const prerequisites_query = `\n
        WHERE NOT EXISTS (
            SELECT 1
            FROM contest_problem_prerequisites cpp
            WHERE cpp.dependent = cp.id
            AND NOT EXISTS (
                SELECT 1
                FROM contest_solves cs
                WHERE cs.problem_id = cpp.depends_on AND cs.team_id = $2
            )
        )\n`;

        
    const query = `
        SELECT 
            json_agg(json_build_object(
                'category', category,
                'challenges', challenges
            ))
        FROM (
            SELECT 
                cp.category, 
                json_agg(json_build_object(
                    'id', cp.id,
                    'title', cp.title,
                    'score', cp.score,
                    'status', CASE WHEN s.problem_id IS NOT NULL THEN 'solved' ELSE 'unsolved' END
                )) AS challenges
            FROM (
                SELECT id, category, title, score
                FROM contest_problems
                WHERE contest_id = $1
                AND (problem_hidden = false OR problem_hidden IS NULL)
                ORDER BY id
            ) cp
            
            LEFT JOIN contest_solves s ON cp.id = s.problem_id AND s.team_id = $2

            ${contest_status != 'finished' ? prerequisites_query : ''}
            
            GROUP BY cp.category
        ) subquery;
    `;

    const params = [contest_id, team_id];
    let result = await Database.run_query(query, params);
    return result;
}


async function get_problem_access(problem_id, user_id){
    const query = `SELECT get_problem_access($1, $2) as access;`;
    const params = [problem_id, user_id];
    let result = await Database.run_query(query, params);
    return result;
}


export default {
    get_hints,
    unlock_hint,
    get_problems_for_organizer,
    get_problems_for_viewer,
    get_problems_for_participant,
    get_problem_access
}
