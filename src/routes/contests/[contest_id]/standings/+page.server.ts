export const load =  async (serverLoadEvent) => {
    const {fetch} = serverLoadEvent;
    const contest_id = serverLoadEvent.params.contest_id;
    const response = await fetch("/dummyAPI/contests/"+contest_id+"/standings"); // error 404?
    const data = await response.json();
    data.sort((a,b) => a.place - b.place);
    console.log(data);
	return {
        standings: data,
        contest_id: contest_id
	};
}