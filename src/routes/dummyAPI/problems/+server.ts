import {json} from '@sveltejs/kit';

const data = [
    {
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",

    },
    {
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
    {
        problem_name: "Easy Rsa",
        date: "18 Dec,2018",
        category: "CRYPTO",
        contest: "BUETCTF24",
    },
]

export async function GET() {
    return json(data);
}