import { ascending } from 'd3';
import Database from './database'

async function post_blog(title,user_id,contents){
    const query = `
    select create_blog_and_contents($1,$2,$3) as return_status
    `
    const params = [title,user_id,contents];
    let result = await Database.run_query(query, params);
    return result;
}

async function edit_blog(blog_id,title,user_id,contents){
    const query = `
    select update_blogs_and_contents($1,$2,$3,$4) as return_status
    `
    const params = [blog_id,title,contents,user_id];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_blog(blog_id,user_id){
    const query = `
    select get_blog_info($1,$2) as blog
    `
    const params = [blog_id,user_id];
    let result = await Database.run_query(query, params);

    return result;
}
async function update_vote(blog_id,user_id,vote,first){
    if(vote == null){
        const query = `
            delete from blogs_votes
            where user_id = $1 and blog_id = $2
        `
        const params = [user_id,blog_id];
        let result = await Database.run_query(query, params);
        return result;
    }
    if(!first){
        const query = `
            insert into blogs_votes (blog_id,user_id,type)
            values ($1,$2,$3)
        `
        const params = [blog_id,user_id,vote];
        let result = await Database.run_query(query, params);
        return result;
    }else{
        const query = `
            update blogs_votes set type = $1
            where user_id = $2 and blog_id = $3
        `
        const params = [vote,user_id,blog_id];
        let result = await Database.run_query(query, params);
        return result;
    }
}

async function delete_blog(blog_id,user_id){
    const query = `
        select delete_blog($1,$2) as return_status
    `
    const params = [blog_id,user_id];
    let result = await Database.run_query(query, params);

    return result;
}

async function add_comment(user_id,blog_id,content){
    const query = `
    SELECT insert_comment($1, $2, $3);
    `
    const params = [user_id,blog_id,content];
    let result = await Database.run_query(query, params);
    return result;
}

async function get_blogs(str,time,vote){
    if(!str) str = "";
    if(!time || time=="none") time = "";
    if(!vote || vote=="none") vote = "";
    let flag = false;
    console.log("search parameters");
    let query = `
        select blogs.id,blogs.title, blogs.created_at, blogs.user_id, blogs.up_votes,blogs.down_votes,users.username
        from blogs
        join users on blogs.user_id = users.id
    `
    let params: String[] = [];
    if (str != null) {
        query += "\nWHERE blogs.title ILIKE ('%' || $1 || '%') OR users.username ILIKE ('%' || $1 || '%')";
        params.push(str);
    }
    if (time != "" || vote != "")
        query += "\nOrder By ";
    if(time != ""){
        query += "blogs.created_at "+time;
        flag = true;
    }
    if(vote != ""){
        if(flag) query += ", "
        if(vote == "ASC")
            query += "blogs.up_votes ASC, blogs.down_votes DESC"
        else
        query += "blogs.down_votes ASC, blogs.up_votes DESC"
    }
    let result = await Database.run_query(query, params);
    return result;

}

async function delete_comment(blog_id,user_id,comment_id){
    const query = `
    DELETE FROM blogs_comments
    WHERE id = $1 AND user_id = $2 AND blog_id = $3;
    `
    const params = [comment_id,user_id,blog_id]

    const result = await Database.run_query(query,params);

    return result;

}

export default {
    post_blog,
    get_blog,
    update_vote,
    edit_blog,
    delete_blog,
    get_blogs,
    add_comment,
    delete_comment
}