const data = [
    {
        catagory : "Digital Forensics",
        challenges : [
            {
                title : "Run Autopsy",
                points : 100,
                id: 1,
                status : "solved"
            },
            {
                title : "Find Password",
                points : 100,
                id: 2,
                status : "unsolved"
            },
            {
                title : "Lets go brrrr",
                points : 100,
                id: 3,
                status : "solved"
            },
            {
                title : "Find malware",
                points : 100,
                id: 1,
                status : "unsolved"
            },
            {
                title : "Last Mod Time",
                points : 100,
                id: 1,
                status : "solved"
            },
            {
                title : "Who's the user???",
                points : 100,
                id: 1,
                status : "unsolved"
            }
        ]
    },

    {
        catagory : "Cryptography",
        challenges : [
            {
                title : "Run Autopsy",
                points : 100,
                id: 1,
                status : "solved"
            },
            {
                title : "Find Password",
                points : 100,
                id: 1,
                status : "unsolved"
            },
            {
                title : "Lets go brrrr",
                points : 100,
                id: 1,
                status : "solved"
            },
            {
                title : "Find malware",
                points : 100,
                id: 1,
                status : "unsolved"
            },
            {
                title : "Last Mod Time",
                points : 100,
                id: 1,
                status : "solved"
            },
            {
                title : "Who's the user???",
                points : 100,
                id: 1,
                status : "unsolved"
            }
        ]
    },

    {
        catagory : "Reverse Engineering",
        challenges : [
            {
                title : "Run Autopsy",
                points : 100,
                id: 1,
                status : "solved"
            },
            {
                title : "Find Password",
                points : 100,
                id: 1,
                status : "unsolved"
            },
            {
                title : "Lets go brrrr",
                points : 100,
                id: 1,
                status : "solved"
            },
            {
                title : "Find malware",
                points : 100,
                id: 1,
                status : "unsolved"
            },
            {
                title : "Last Mod Time",
                points : 100,
                id: 1,
                status : "solved"
            },
            {
                title : "Who's the user???",
                points : 100,
                id: 1,
                status : "unsolved"
            }
        ]
    },
];

import { json } from '@sveltejs/kit';


export function GET() {
    return json(data);
}

