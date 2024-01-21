import { json } from '@sveltejs/kit';

const data = [
    {
        id : 1,
        name : "Easy Rsa",
        score : 50,
        author : {id: 1, username: "Saad"},
        description : `Rsa rsa rsa rsa rsa rsa rsa rsa rsa rsa rsa rsa rsa rsa
    
### connection info
    
        nc 0.cloud.chals.io 34879
        `,
    
        attachments : [
            {name : "rsa.py", url : "https://google.com"},
        ],
    
        max_attempts : 10,
        attempted : 3,
        flag_format : "buet_ctf{Th1s_1s_4n_3x4mpl3_f14g}",
        hints : [
            "Think about prime factorization",
            "Is there so many known large primes?"
        ],
        tags : [
            "cryptography",
            "reverse",
        ],
        writeups : [
            {
                id: 1,
                title: "Hackers Writeup",
            },
            {
                id: 2,
                title: "Noobs Writeup",
            }
        ],
        verdicts : {
            correct : 10,
            wrong : 20,
        }
    },
    {
        id : 2,
        name : "Hard Reverse",
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
        hints : [
            "This is a hint",
            "This is another hint"
        ],
        tags : [
            "reverse",
            "easy"
        ],
        writeups : [
            {
                id: 1,
                title: "Writeup 1",
            },
            {
                id: 2,
                title: "Writeup 2",
            },
            {
                id: 3,
                title: "Writeup 3",
            },
        ],
        verdicts : {
            correct : 80,
            wrong : 20,
        }
    }
]

export function GET(requestEvent){
    const { params } = requestEvent;
    const { problem_id } = params;
    const problem = data.find(problem => problem.id == problem_id);
    console.log(problem_id);
    if (problem) {
        return json(problem);
    }else{
        return json({error : "Problem not found"}, 404);
    }
}