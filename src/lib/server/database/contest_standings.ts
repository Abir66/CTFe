import Database from './database'

async function get_team_standings(contest_id){
    const query = `
    SELECT contest_solves.team_id,SUM(EXTRACT(EPOCH FROM (contest_solves.created_at - contests.start_time))) AS time_diff, teams.name ,SUM((contest_problems.score)-y.penalty_score) as final_score
    FROM contest_solves
    JOIN teams ON contest_solves.team_id = teams.id
    JOIN contest_problems ON contest_problems.id = contest_solves.problem_id
    JOIN contests ON contest_problems.contest_id = contests.id
    JOIN
      (SELECT hint_unlocks.team_id,teams.name,(hints.penalty_score),contest_solves.problem_id
      FROM hints
      JOIN hint_unlocks ON hints.id = hint_unlocks.hint_id
      JOIN contest_solves ON contest_solves.problem_id = hints.problem_id
      JOIN teams on teams.id = hint_unlocks.team_id
      WHERE teams.contest_id = $1
      AND contest_solves.team_id = hint_unlocks.team_id) as y on y.team_id = teams.id
    WHERE contest_solves.contest_id = $1
    AND contest_problems.id = y.problem_id
    GROUP BY contest_solves.team_id,teams.name
    ORDER BY final_score DESC,time_diff ASC
    `;
    const params = [contest_id];
    let result = await Database.run_query(query, params);
    return result;
}


async function get_standings_organizer_view(contest_id, team_name='', show_banned=false){
  let query = `
          WITH TeamRanks AS (
            SELECT 
                team_id,
                name,
                COALESCE(time_diff, 0) AS time_diff,
                final_score,
                hint_penalty,
                status,
                solve_count,
                RANK() OVER (ORDER BY final_score DESC) AS rank
            FROM (
                SELECT 
                    t.id AS team_id,
                    t.name,
                    t.status,
                    SUM(EXTRACT(EPOCH FROM (cs.created_at - c.start_time)) / 60)::INT AS time_diff,
                    SUM(COALESCE(cp.score,0) - COALESCE(h.hints_score, 0)) AS final_score,
                    COALESCE(SUM(h.hints_score), 0) AS hint_penalty,
                    COUNT(cs.problem_id) AS solve_count
                FROM 
                    teams t
                LEFT JOIN contest_solves cs ON t.id = cs.team_id
                LEFT JOIN contest_problems cp ON cs.problem_id = cp.id
                LEFT JOIN contests c ON cp.contest_id = c.id
                LEFT JOIN (
                    SELECT 
                        hu.team_id,
                        h.problem_id,
                        SUM(h.penalty_score) AS hints_score
                    FROM 
                        hint_unlocks hu
                    JOIN hints h ON hu.hint_id = h.id
                    GROUP BY 
                        hu.team_id, h.problem_id
                ) h ON t.id = h.team_id AND cp.id = h.problem_id
                WHERE 
                    t.contest_id = $1 ${show_banned ? '' : "AND (t.status is null or t.status <> 'banned' )"}
                GROUP BY 
                    t.id, t.name, t.status
            ) AS subquery
        )
        SELECT 
            *
        FROM 
            TeamRanks
        WHERE 
            name ILIKE '%' || $2 || '%'
        ORDER BY 
            rank,
            time_diff ASC,
            lower(name) ASC; 
  `
  let params = [contest_id, team_name];
  const result = await Database.run_query(query, params);
  return result;
}


export default {
    get_team_standings,
    get_standings_organizer_view
}
