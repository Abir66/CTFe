const data = [
    {
        team_id: 1,
        place: 1,
        team_name: "b01lers",
        Points: 3200,
        
    },
    {
        team_id: 2,
        place:3,
        team_name: "nOOb_squad",
        Points: 1200,
    }
    ,
    {
        team_id: 3,
        place: 2,
        team_name: "Potato Hackers",
        Points: 2200,
    }
    ,
    {
        team_id: 4,
        place: 5,
        team_name: "0xRobiul",
        Points: 200,
    }
    ,
    {
        team_id: 5,
        place: 4,
        team_name: "Noobies",
        Points: 800,
    }
];

import { json } from '@sveltejs/kit';


export function GET() {
    return json(data);
}
