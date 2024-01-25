export const load = async ({url,fetch,params}) => {
    const res = await fetch("dummyAPI/contests");
    const data = await res.json();
    return {
        contest_list : data
    }
}