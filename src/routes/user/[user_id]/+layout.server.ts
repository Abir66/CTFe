import { error } from "@sveltejs/kit";
import { run_query } from "$lib/server/database/database";

export const load = async ({params}) => {

    const user_id = params.user_id;

    const response = await run_query(
        'SELECT id, created_at, username, email FROM users WHERE id = $1',
        [user_id]
    );

    if(!response.success) error(500, "Something went wrong");

    if(response.data.length==0)
    {
        error(404, "User not found");
    }
    else
    {
        return   response.data[0];
    }

}
