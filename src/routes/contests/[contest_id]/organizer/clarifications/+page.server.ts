import { error, redirect, type Actions, fail } from '@sveltejs/kit';
import standings from '$lib/server/database/contest_standings';
import clarifications from '$lib/server/database/contest_clarification';
import users from '$lib/server/database/users';

export const load =  async (serverLoadEvent) => {
    const {fetch,locals} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    let result = await clarifications.get_clarifications_organizer(locals.user.id,contest_id);
	return {
        clarifications: result.data,
        contest_id: contest_id
    }; 
}