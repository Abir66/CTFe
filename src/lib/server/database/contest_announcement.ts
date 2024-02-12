import Database from './database'

async function get_announcements(contest_id){
    const query = `
        select id,title,description from announcements
        where contest_id = $1
    `;
    const params = [contest_id];
    let result = await Database.run_query(query, params);
    return result;
}


export default {
    get_announcements,
}