import  Database  from './database';
async function create_contest(title, begindate, enddate, type,password,maxmember,created_by) {

    const query = `
        INSERT INTO contests (contest_name,start_time,end_time,type,contest_password,memberlimit,created_by)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING id;
    `;

    const params = [title, begindate, enddate, type, password, maxmember, created_by];
    const result = await Database.run_query(query, params);
    return result;
}

async function update_contest(title, begindate, enddate, type,password,maxmember,contest_id, registration_paused) {

    const query = `
        update contests set contest_name=$1,start_time=$2,end_time=$3,type=$4,contest_password=$5,memberlimit=$6,registration_paused=$8 where id=$7
    `;

    const params = [title, begindate, enddate, type, password, maxmember, contest_id, registration_paused];
    const result = await Database.run_query(query, params);
    console.log(result);
    
    return result;
}
async function delete_contest(contest_id) {

    const query = `
        delete from contests where id=$1
    `;

    const params = [contest_id];
    const result = await Database.run_query(query, params);
    console.log(result);
    
    return result;
}
export default {create_contest,
    update_contest,
    delete_contest};