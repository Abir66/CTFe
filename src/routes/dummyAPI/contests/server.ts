const data= {
    "upcoming": [{
        contest_id: 1,
        contest_name: "Knight CTF - future",
        start_time: "2021-01-24 17:35:00",
        duration: 7200,
    },
    {
        contest_id: 2,
        contest_name: "Pico CTF - -future",
        start_time: "2021-01-24 17:35:00",
        duration: 7200,
    }
    ],
    "current": [{
        contest_id: 3,
        contest_name: "Knight CTF",
        start_time: "2021-01-24 17:35:00",
        duration: 7200,
    },
    {
        contest_id: 4,
        contest_name: "Pico CTF",
        start_time: "2021-01-24 17:35:00",
        duration: 7200,
    }
    ],
    "past": [{
        contest_id: 5,
        contest_name: "Knight CTF - past",
        start_time: "2021-01-24 17:35:00",
        duration: 7200,
    },
    {
        contest_id: 6,
        contest_name: "Pico CTF -past",
        start_time: "2021-01-24 17:35:00",
        duration: 7200,
    }
    ]
}


export function GET(){
    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}