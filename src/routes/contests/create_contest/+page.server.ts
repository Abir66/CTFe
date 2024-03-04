import { message, superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';
import createContest from '$lib/server/database/contest_creation';
const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const load: PageServerLoad = async () => {
    // Server API:
    const form = await superValidate(schema);

    // Always return { form } in load and form actions.
    return { form };
};

export const actions: Actions = {
    default: async ({ request, url, locals }) => {
        const formdata = await request.formData();
        const body = Object.fromEntries(formdata);
        // console.log(body);
        const start_date = new Date(body.begindate.toString() + "," + body.begintime.toString());
        const end_date = new Date(body.enddate.toString() + "," + body.endtime.toString());
        if (body.title == "" || body.description == "" || body.begindate == "" || body.begintime == "" || body.enddate == "" || body.endtime == "" || body.duration == "") {
            return fail(400, { emptyfields: true });
        }
        else if (body.begindate < new Date().toISOString().split('T')[0]) {
            return fail(400, { begindatebeforenow: true });
        }
        else if (body.enddate < body.begindate) {
            return fail(400, { enddatebeforebegindate: true });
        }
        else if (body.enddate == body.begindate && body.endtime <= body.begintime) {
            return fail(400, { enddatebeforebegindate: true });
        }

        let result = await createContest.create_contest(body.title, start_date, end_date, body.type, body.type == "private" ? body.password : null, body.maxmember, locals.user.id);
        
        if (result.success) {
            throw redirect(303, '/contests/' + result.data[0].id + '/organizer');
        }

    }
};