
export const load = async ({url,fetch,params}) => {
   
    const res = await fetch("dummyAPI/contests");
    const data = await res.json();
    console.log(data);
    console.log(url.searchParams.getAll('status'));
    let status=url.searchParams.getAll('status');
    let upcoming=[];
    let current=[];
    let past=[];
    if(status.length>0)
    {
       if(status.includes('all'))
       {
            upcoming=data.upcoming;
            current=data.current;
            past=data.past;
        
       }
       else
       {
        if(status.includes('upcoming'))
        {
            upcoming=data.upcoming;
        }
        if(status.includes('current'))
        {
            current=data.current;
        }
        if(status.includes('past'))
        {
            past=data.past;
        }
       }
    }
    else
    {
        upcoming=data.upcoming;
        current=data.current;
        past=data.past;
    }
    
    return {

        upcoming: upcoming,
        current: current,
        past: past
    }
}