import Database from "./database";

async function is_registered_to_contest(contest_id,user_id) {
    const query = `
       SELECT team_id FROM team_members WHERE user_id=$1 and contest_id=$2
    `;
    const params = [user_id,contest_id];
    let result = await Database.run_query(query, params);
   
    return result;
}

async function is_user_exist(user_id) {

    const query = `
    SELECT COUNT(*) FROM users WHERE id=$1
    `;
    const params = [user_id];
    let result = await Database.run_query(query, params);
    
   
     if(result.data[0].count>0)
     {
           return true;
     }
    return false;
}
async function user_participated_contest_list(user_id) {
    const query = `
    select table1.contest_id , table1.contest_name , table1.start_time, table1.type ,table2.solved ,table1.team_name
    from
    (
     select t.contest_id , contest_name , start_time ,type ,teams.name as team_name
    from contests c
    inner join  team_members t on t. contest_id = c.id and t.user_id=$1
    inner join teams on teams.id =t.team_id
    ) as table1
    
    left join (select Count (*) as solved , contest_id
    from  contest_solves
    where user_id =$1
    group by contest_id) as table2 on table1.contest_id= table2.contest_id
    `;
    const params = [user_id];
    let result = await Database.run_query(query, params);
 
    
    return result;
}

async function Number_of_contest_user_Participated_in(user_id) {

    
    const query = `
    select count(*) as contest_count
    from team_members
    where user_id =$1
    `;
    const params = [user_id];
    let result = await Database.run_query(query, params);
   
    return result;
}
async function user_problem_stat_categorywise(user_id) {

    const query = `
    select table1.category , table1.total, table2.count
    from (
    select category , count(*) as total
    from contest_problems
    group by category
    ) as table1 
    left join 
    (select p.category , count(*) as count
    from contest_problems p 
    inner join contest_solves s on p.id=s.problem_id 
    where s.user_id =$1
    group by p.category) as table2 on table1.category=table2.category
    `;

    const params = [user_id];
    let result = await Database.run_query(query, params);
    
    return result;
}
async function Number_of_contest_user_Organized(user_id) {

    
    const query = `
    select count(*) as contest_organized
from organizers
where user_id =$1
    `;
    const params = [user_id];
    let result = await Database.run_query(query, params);
   
    return result;
}

async function user_organized_contest_list(search_str, type, status,user_id) {
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
            inner join organizers o on o.contest_id = contests.id
            and o.user_id = $1
    `;

    let params: String[] = [];
    params.push(user_id);
    if (search_str != "") {
        query += "\nWHERE contests.contest_name ILIKE ('%' || $2 || '%') ";
        params.push(search_str);
    }

    if (type != "all" && type) {
        params.length == 1 ? query += "\nWHERE\t" : query += "\nAND\t";
        params.push(type);
        query += "contests.type = $" + params.length;
    }

    if (status == "upcoming" || status == "running" || status == "finished") {
        params.length == 1 ? query += "\nWHERE\t" : query += "\nAND\t";
        if (status == "upcoming") query += "\ncontests.start_time > NOW()";
        else if (status == "running") query += "\ncontests.start_time <= NOW() AND contests.end_time >= NOW()";
        else if (status == "finished") query += "\ncontests.start_time <= NOW() AND contests.end_time < NOW()";
    }

    query += "\nORDER BY contests.start_time DESC;";
    
    let result = await Database.run_query(query, params);
    return result;
}

async function user_solved_problems(user_id) {

    
    const query = `
    select p.id, p.title , c.contest_name , p.category , s.created_at
    from contest_solves s 
    inner join contest_problems p on  s.problem_id = p.id and s.user_id=$1
    inner join contests c on p.contest_id = c.id
    `;
    const params = [user_id];
    let result = await Database.run_query(query, params);
    
    return result;
}
async function Number_of_problem_user_solved(user_id) {

    
    const query = `
    select count(*) as count 
    from contest_solves
    where user_id =$1
    `;
    const params = [user_id];
    let result = await Database.run_query(query, params);
   
    return result;
}

async function Number_of_blogs_user_wrote(user_id){
    const qauery = `
        select count(*) as count
        from blogs
        where user_id = $1
    `
    const params = [user_id];
    let result = await Database.run_query(qauery, params);
    return result;
}

async function user_created_blogs_list(user_id){
    const query = `
        select id, title, created_at,up_votes,down_votes
        from blogs
        where user_id = $1
    `
    const params = [user_id];
    let result = await Database.run_query(query, params);
    return result;
}

export default 
{
    is_registered_to_contest,
    is_user_exist,
    user_participated_contest_list,
    user_organized_contest_list,
    user_solved_problems,
    Number_of_contest_user_Participated_in,
    Number_of_contest_user_Organized,
    Number_of_problem_user_solved,
    user_problem_stat_categorywise,
    Number_of_blogs_user_wrote,
    user_created_blogs_list

}