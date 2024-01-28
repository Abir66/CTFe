const data={
    id : 1,
    name : "Easy Reverse",
    score : 100,
    author : {id: 1, username: "Auntor"},
    description : `We made a fake flag generator just for this CTF! It can generate flags that look like the real one! Can you find the real flag?

### connection info

    nc 0.cloud.chals.io 34879
    `,

    attachments : [
        {name : "flag_generator.py", url : "https://google.com"},
        {name : "encrypted.txt", url : "https://google.com"},
    ],

    max_attempts : 10,
    attempted : 3,
    flag_format : "buet_ctf{Th1s_1s_4n_3x4mpl3_f14g}",
}


import { json } from '@sveltejs/kit';


export function GET({params}) {
    return json(data);
}
