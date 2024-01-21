export const load =  async (serverLoadEvent) => {
    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    const challenge_id = serverLoadEvent.params.challenge_id;
    const response = await fetch("/dummyAPI/contests/"+contest_id+"/challenges/"+challenge_id);
    const data = await response.json();

	return {
        challenge : data,
	};
}