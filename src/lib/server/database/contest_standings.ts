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



export default {
    get_team_standings,
}
