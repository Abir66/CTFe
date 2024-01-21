import {json} from '@sveltejs/kit';

const data = [
    {
        problem_id: 1,
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",

    },
    {
        problem_id: 2,
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_id: 3,
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_id: 4,
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_id: 5,
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_id: 6,
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_id: 7,
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_id: 8,
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
]

export async function GET() {
    return json(data);
}

