import Database from './database';


async function Add_problem(body, user_id, contest_id) {
  const query = `
    insert into contest_problems (contest_id, category,title,score,max_attempts,author_id) values($1,$2,$3,$4,$5,$6) returning id;
    `;
  const params = [contest_id, body.category, body.title, body.points, body.maxAttempt, user_id];
  let result = await Database.run_query(query, params);
  console.log(result);
  return result;
}

async function Add_variations(body, problem_id) {
  const query = `
    insert into
    problem_variations (description, flags, problem_id, variation_name)
  values
    ($1, $2, $3, $4)
  returning
    id;
    `;

  const params = [body.description, [body.flag], problem_id, body.name];
  let result = await Database.run_query(query, params);
  console.log(result);

  return result;
}
async function Add_attachments(url, variation_id, name) {
  const query = `
  insert into
  problem_attachments  (variation_id,link,file_name,saved_on_storage)
values
  ($1, $2, $3, $4)
returning
  *;
  `;

  const params = [variation_id, url, name, true];
  let result = await Database.run_query(query, params);
  console.log(result);

  return result;
}

async function  Remove_attachment(id) {
  const query = `
  delete from problem_attachments where id=$1
  `;

  const params = [id];
  let result = await Database.run_query(query, params);
  console.log(result);

  return result;
}


async function Add_hint(problem_id, description, has_penalty, penalty_score) {
  const query = `
  insert into
  hints  (problem_id,description,has_penalty,penalty_score)
values
  ($1, $2, $3, $4)
returning
  id;
  `;

  const params = [problem_id, description, has_penalty, penalty_score];
  let result = await Database.run_query(query, params);
  console.log(result);

  return result;
}
async function Add_requirement(dependent, depends_on) {
  const query = `
  insert into
  contest_problem_prerequisites(dependent,depends_on)
values
  ($1, $2)
;
  `;

  const params = [dependent, depends_on];
  let result = await Database.run_query(query, params);
  console.log(result);

  return result;
}
async function Remove_requirement(dependent, depends_on) {
  const query = `
  delete from contest_problem_prerequisites where dependent=$1 and depends_on=$2
;
  `;

  const params = [dependent, depends_on];
  let result = await Database.run_query(query, params);
  console.log(result);

  return result;
}
async function get_problems(contest_id) {
  const query = `
  select p.id,p.contest_id,p.title,p.score,p.author_id,p.category,
  u.username as author_name from contest_problems p left join users u on p.author_id=u.id where contest_id=$1;
  `;

  const params = [contest_id];
  let result = await Database.run_query(query, params);
  console.log(result);

  return result;
}
async function get_requirements(problem_id) {
  const query = `
  select * from contest_problems where id in (select depends_on from contest_problem_prerequisites where dependent=$1)
  `;
  const params = [problem_id];
  let result = await Database.run_query(query, params);
  console.log(result);
  return result;

}

async function delete_hint_by_id(id) {
  const query = `
  delete from hints where id=$1
  `;
  const params = [id];
  let result = await Database.run_query(query, params);
  console.log(result);
  return result;

}
async function Editproblem(problem_id, title, points, maxAttempts, category) {
  const query = `
  update contest_problems set title=$1,score=$2,max_attempts=$3,category=$4 where id=$5 returning *;
  `;
  const params = [title, points, maxAttempts, category,problem_id];
  let result = await Database.run_query(query, params);
  console.log(result);
  return result;
}
async function Edit_variation(id, name, description) {
  const query = `
  update problem_variations set variation_name=$1,description=$2 where id=$3 returning *;
  `;
  const params = [name, description, id];
  let result = await Database.run_query(query, params);
  // console.log(result);
  return result;
}


async function Add_flag(id, flag) {
  const query = `
  update problem_variations set flags=array_append(flags,$1) where id=$2 returning *;
  `;
  const params = [flag, id];
  let result = await Database.run_query(query, params);
  // console.log(result);
  return result;
}
async function Remove_flag(id, flag) {
  const query = `
   update problem_variations set flags=array_remove(flags,$1) where id=$2 returning *;
  `;
  const params = [flag, id];
  let result = await Database.run_query(query, params);
  // console.log(result);
  return result;
}

async function get_variations(problem_id) {
  const query = `
  SELECT
    pv.*,
    json_agg(json_build_object(
        'id', a.id,
        'file_name', a.file_name,
        'link', a.link,
        'variation_id', v.id,
        'saved_on_storage',a.saved_on_storage
    )) AS attachment
FROM
    problem_variations pv
LEFT JOIN
    problem_attachments a ON a.variation_id = pv.id
LEFT JOIN
    problem_variations v ON v.id = a.variation_id
WHERE
    pv.problem_id = $1
GROUP BY
    pv.id;
  `;
  const params = [problem_id];
  let result = await Database.run_query(query, params);
  // console.log(result);
  return result;
}

export default {
  Add_problem,
  Add_variations,
  Add_attachments,
  Add_hint,
  Add_requirement,
  get_problems,
  get_requirements,
  delete_hint_by_id,
  Editproblem,
  Remove_requirement,
  Edit_variation,
  Add_flag,
  Remove_flag,
  get_variations,
  Remove_attachment

}

