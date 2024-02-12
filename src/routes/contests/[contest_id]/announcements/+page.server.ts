import { error } from '@sveltejs/kit';
import standings from '$lib/server/database/contest_standings';
import announcements from '$lib/server/database/contest_announcement';

export const load =  async (serverLoadEvent) => {
    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    let result = await announcements.get_announcements(contest_id);
	return {
        announcements: result.data,
        contest_id: contest_id
    }; 
}