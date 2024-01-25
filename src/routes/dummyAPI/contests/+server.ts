const data= [
    {
        contest_id: 1,
        contest_name: "Knight CTF - future",
        start_time: "2021-01-24 17:35:00",
        duration: 7200, status: 'upcoming',type: 'public'
    },
    {
        contest_id: 2,
        contest_name: "Pico CTF - -future",
        start_time: "2021-01-24 17:35:00",
        duration: 7200, status: 'running',type: 'official'
    },
    {
        contest_id: 3,
        contest_name: "Knight CTF",
        start_time: "2021-01-24 17:35:00",
        duration: 7200, status: 'upcoming',type: 'private'
    },
    {
        contest_id: 4,
        contest_name: "Pico CTF",
        start_time: "2021-01-24 17:35:00",
        duration: 7200, status: 'running',type: 'public'
    },
    {
        contest_id: 5,
        contest_name: "Knight CTF - past",
        start_time: "2021-01-24 17:35:00",
        duration: 7200, status: 'finished',type: 'public'
    },
    {
        contest_id: 6,
        contest_name: "Pico CTF -past",
        start_time: "2021-01-24 17:35:00",
        duration: 7200, status: 'running',type: 'official'
    },
    {
        contest_id: 3,
        contest_name: "Knight CTF",
        start_time: "2021-01-24 17:35:00",
        duration: 7200, status: 'upcoming',type: 'public'
    },
    {
        contest_id: 4,
        contest_name: "Pico CTF",
        start_time: "2021-01-24 17:35:00",
        duration: 7200, status: 'running',type: 'private'
    },
    {
        contest_id: 5,
        contest_name: "Knight CTF - past",
        start_time: "2021-01-24 17:35:00",
        duration: 7200, status: 'finished',type: 'public'
    },
    {
        contest_id: 6,
        contest_name: "Pico CTF -past",
        start_time: "2021-01-24 17:35:00",
        duration: 7200, status: 'running',type: 'public'
    }
]

import { json } from '@sveltejs/kit';

export function GET(){
   return json(data);
}