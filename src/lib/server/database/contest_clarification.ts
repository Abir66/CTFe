import Database from './database'



async function get_clarifications(user_id,contest_id){
    let team_id = await get_team_id(user_id,contest_id);
    team_id = team_id.data[0].id;
    const query = `
        select contest_threads.id,contest_threads.title,contest_threads.created_at as time,users.username 
        from contest_threads
        join team_members on team_members.user_id = contest_threads.user_id
        join users on users.id = team_members.user_id
        and team_members.team_id = $1
        and team_members.contest_id = $2
    `;
    const params = [team_id,contest_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_clarification(user_id,contest_id,thread_id){
    let team_id = await get_team_id(user_id,contest_id);
    team_id = team_id.data[0].id;
    const query = `
        select contest_threads.id,contest_threads.title,contest_threads.created_at as time,users.username 
        from contest_threads
        join team_members on team_members.user_id = contest_threads.user_id
        join users on users.id = team_members.user_id
        and team_members.team_id = $1
        and team_members.contest_id = $2
        and contest_threads.id = $3
    `;
    const params = [team_id,contest_id,thread_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function add_clarification(user_id,contest_id,title){

    let team_id = await get_team_id(user_id,contest_id);
    if(team_id.data.length == 0){
        return null;
    }
    team_id = team_id.data[0].id;
    const query = `
        insert into contest_threads(user_id,contest_id,team_id,title)
        values($1,$2,$3,$4)
    `;
    const params = [user_id,contest_id,team_id,title];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_clarification_chats(user_id,contest_id,thread_id){
    let allowed = await is_allowed(user_id,contest_id,thread_id);
    console.log(allowed);
    if(allowed.data[0].exists == false){
        return null;
    }
    const query = `
        select contest_threads_chats.id,contest_threads_chats.user_id,users.username,contest_threads_chats.created_at as time,contest_threads_chats.text,contest_threads_chats.image from contest_threads_chats
        join contest_threads on contest_threads.id = contest_threads_chats.thread_id
        join users on users.id = contest_threads_chats.user_id
        where contest_id = $1 and thread_id = $2
    `;
    const params = [contest_id,thread_id];
    let result = await Database.run_query(query, params);
    console.log(result);
    return result;
}

async function is_allowed(user_id,contest_id,thread_id){
    let team_id = await get_team_id(user_id,contest_id);
    if(team_id.data.length == 0){
        return null;
    }
    team_id = team_id.data[0].id;
    const query = `
        select exists (select 1 from (
            (select team_members.user_id from team_members
            join contest_threads on contest_threads.contest_id = team_members.contest_id
            where team_members.contest_id = $2 and team_members.team_id = $3 and contest_threads.id = $4)
        union
        (select user_id from organizers
        where contest_id = $2)) as y
        where y.user_id = $1)
    `
    const params = [user_id,contest_id,team_id,thread_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_team_id(user_id,contest_id){
    const query = `
        select id from teams
        join team_members on team_members.team_id = teams.id
        where team_members.user_id = $1 and teams.contest_id = $2
    `;
    const params = [user_id,contest_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function add_thread_chat(user_id,contest_id,thread_id,text,image){
    let allowed = await is_allowed(user_id,contest_id,thread_id);
    if(allowed.data[0].exists == false){
        return null;
    }
    let image_url = null;
    const query = `
        insert into contest_threads_chats(user_id,text,image,thread_id)
        values($1,$2,$3,$4)
    `;
    const params = [user_id,text,image_url,thread_id];
    let result = await Database.run_query(query, params);
    return result;
}

export default {
    get_clarifications,
    add_clarification,
    get_clarification_chats,
    get_clarification,
    add_thread_chat

}