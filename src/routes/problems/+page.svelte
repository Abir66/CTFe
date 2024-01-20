<script>
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

</script>

<h1 class="mb-2 text-3xl font-bold leading-none tracking-tight text-gray-900  dark:text-white">Problems</h1>
<hr class="w-48 h-1 bg-black border-0 rounded dark:bg-gray-700">
<div class='flex w-3/4 items-center border-b-2 border-b-black py-2 dark:border-gray-700 '>
    <p class='w-1/4 px-4 lg:text-lg'>Problem</p><p class='w-1/4 px-4 lg:text-lg'>Date</p><p class='w-1/4 px-4 lg:text-lg'>Category</p><p class='w-1/4 px-4 lg:text-lg'>Contest</p>
</div>
{#each data as item}
    <div class='flex w-3/4 items-center rounded border-2 border-black my-2 dark:border-gray-700 '>
        <p class='w-1/4 lg:text-lg p-4 '>{item.problem_name}</p><p class='w-1/4 text-base md:test-lg lg:text-lg p-4 '>{item.date}</p><p class='w-1/4 lg:text-lg p-4 '>{item.category}</p><p class='w-1/4 lg:text-lg p-4 '>{item.contest}</p>
    </div>
{/each}