import Database from "./database";

async function is_registered_to_contest(contest_id,user_id) {

    
    const query = `
       SELECT team_id FROM team_members WHERE user_id=$1 and contest_id=$2
    `;
    const params = [user_id,contest_id];
    let result = await Database.run_query(query, params);
   
    return result;
}

export default 
{
    is_registered_to_contest
}