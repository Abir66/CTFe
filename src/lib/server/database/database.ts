import pg from 'pg'
import { db_host, db_port, db_user, db_password, db_database } from '$env/static/private';

const pool = new pg.Pool({
  user: db_user,
  host: db_host,
  database: db_database,
  password: db_password,
  port: db_port,
});


export const run_query = async function(query, params) {
    try {
        const data = await pool.query(query, params);
        return {
            success: true,
            data: data.rows
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}

export default{
    run_query
}

