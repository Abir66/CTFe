const contest_data={
    contest_id : "1",
    contest_name : "BUET CTF",
    start_time : "May 02 2023, 00:00:00",
    end_time : "May 02 2023, 00:00:00",
    organizers : [{id: "1", name:"Abir"}, {id: "2", name:"Saad"}],
    format : "Jeopardy",
    status : "ongoing",

    description : `

CTFBD is a jeopardy style CTF for students interested in cybersecurity. CTFBD is designed to help students explore newer domains in cybersecurity as well as help existing professionals practise their skills. We will feature challenges which cover various domains of cybersecurity including cryptography, reversing, forensics, web exploitation, pwn and more!

## Prizes
T shirt for top 5 teams

## Rules
The following rules  will be strictly follwed
1. FLAG SHARING is strongly prohibited, any team doing so will be banned from the contest right away,
2. There will be max 10 attempts for each problem,
3. Credentials will be send to teams via email,
4. Join our discord server to get any kind of technical help
`,

    total_registered_teams : 142,
    team_shortlist: [
        {id: "1", name:"Potato Hackers"},
        {id: "2", name:"Kichu Pari na"},
        {id: "3", name:"N00b Squad"},
        {id: "4", name:"Hackermen"},
        {id: "5", name:"Team 5"},
    ]

}


import { json } from '@sveltejs/kit';


export function GET() {
    return json(contest_data);
}

