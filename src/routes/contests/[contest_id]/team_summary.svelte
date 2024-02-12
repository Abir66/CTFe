<script lang='ts'>
    import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from "$lib/components/ui/separator";
    import { Skeleton } from "$lib/components/ui/skeleton";


    export let contest_id;
    let dataLoaded = false;
    
    onMount(async () => {
        // const response = await fetch(`/api/my_team/${contest_id}`);
        // const data = await response.json();
        // console.log(data);
        dataLoaded = true;
    });


</script>


    
{#if dataLoaded}
    <div class="p-10">
        <p class="flex justify-center text-xl sm:text-3xl underline font-bold mb-10 sm:mb-20">Team Unga Bunga</p>
        <!-- Center dis -->
        <div class="flex flex-col gap-y-5 justify-center sm:flex-row sm:gap-y-0 sm:gap-x-20 w-full">
            <div class="flex flex-col gap-y-2 items-center">
                <p class="text-5xl sm:text-7xl font-bold">5</p>
                <p class="text-2xl font-semibold">Solves</p>
            </div>
        
            <div class="flex flex-col gap-y-2 items-center">
                <p class="text-5xl sm:text-7xl font-bold">1235</p>
                <p class="text-2xl font-semibold">Points</p>
            </div>
            
            <div class="flex flex-col gap-y-2 items-center">
                <p class="text-5xl sm:text-7xl font-bold">3rd</p>
                <p class="text-2xl font-semibold">Place</p>
            </div>
        </div>
    </div>
{:else}
    <div class="p-10">
        <div class="flex flex-col gap-y-5 justify-center sm:flex-row sm:gap-y-0 sm:gap-x-20 w-full">
            <div class="flex flex-col gap-y-2 items-center">
                <Skeleton class="w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-md" />
            </div>
            <div class="flex flex-col gap-y-2 items-center">
                <Skeleton class="w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-md" />
            </div>
            <div class="flex flex-col gap-y-2 items-center">
                <Skeleton class="w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-md" />
            </div>
            
        </div>
    </div>
{/if}
