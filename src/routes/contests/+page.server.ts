
export const load = async ({url,fetch}) => {
   
    const res = await fetch("dummyAPI/contests");
    const data = await res.json();
    console.log(data);
    console.log(url);
   

    return {

        upcoming: data.upcoming,
        current: data.current,
        past: data.past
    }
}