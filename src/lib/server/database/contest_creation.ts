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

export default {create_contest};