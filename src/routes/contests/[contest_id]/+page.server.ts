export const load =  async (serverLoadEvent) => {
    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    const response = await fetch("/dummyAPI/contests/"+contest_id); 
    const data = await response.json();

	return {
        contest_details : data
	};
}