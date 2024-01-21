<script>
    export let hint;
    export let index;
    let isOpen = false;
    let toggle = () => {
        isOpen = !isOpen;
    }
</script>

<div class="border px-5 my-2 rounded border-black dark:border-gray-700 overflow-hidden truncate overflow-ellipsis whitespace-nowrap">
    <div class="flex flex-row items-center">
        <div class=""><u>Hint{index}</u></div>
        <div>
            {#if !isOpen}
                <svg class="w-3 h-3 m-2 hover:cursor-pointer  text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8" on:click={toggle}>
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
                </svg>
            {:else}
                <svg class="w-3 h-3 m-2 hover:cursor-pointer  text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8" on:click={toggle}>
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 7 5.326-5.7a.909.909 0 0 1 1.348 0L13 7"/>
                </svg>
            {/if}
        </div>
    </div>
    {#if isOpen}
        <div class="">{hint}</div>
    {/if}
</div>