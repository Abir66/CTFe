import { local } from 'd3';
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

async function add_announcement(contest_id, title, description, user_id){
    const query = `
        insert into announcements (contest_id, title, description, announcer)
        values ($1, $2, $3, $4)
    `;
    const params = [contest_id, title, description,user_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function delete_announcement(announcement_id){
    const query = `
        delete from announcements where id = $1
    `;
    const params = [announcement_id];
    let result = await Database.run_query(query,params);

    return result;
}


export default {
    get_announcements,
    add_announcement,
    delete_announcement
}