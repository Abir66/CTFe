<script lang='ts'>
    import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from "$lib/components/ui/separator";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card";

    export let team_id;
    let dataLoaded = false;
    let error = ''
    let data;
    let team_score
    
    onMount(async () => {
        error = ''
        const response = await fetch(`/api/team/${team_id}/team_score`);
        data = await response.json(); 
        if(data.success){
            team_score = data.data
        }
        else{
            if(data.message) error = data.message;
            else error = 'Something went wrong'
        }

        dataLoaded = true;
    });


</script>


    
{#if dataLoaded}
    <div class="p-10">
        <div class="flex flex-col gap-y-5 justify-center sm:flex-row sm:gap-y-0 sm:gap-x-20 w-full">
            <div class="flex flex-col gap-y-2 items-center">
                <Card.Root class="w-[200px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-md">
                    <Card.Content class="w-full h-full flex flex-col justify-center items-center align-middle">
                        <div class="w-full h-full flex flex-col gap-y-2 justify-center items-center align-middle">
                            <p class="font-bold text-4xl">{team_score.solve_count}</p>
                            <p class="text-xl">{team_score.solve_count > 1 ? 'Solve':'Solves'}</p>
                        </div>
                    </Card.Content>
                  </Card.Root>
            </div>
            <div class="flex flex-col gap-y-2 items-center">
                <Card.Root class="w-[200px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-md">
                    <Card.Content class="w-full h-full flex flex-col justify-center items-center align-middle">
                        <div class="w-full h-full flex flex-col gap-y-2 justify-center items-center align-middle">
                            <p class="font-bold text-4xl">{team_score.hint_penalty}</p>
                            <p class="text-xl">Hint Penalty</p>
                        </div>
                    </Card.Content>
                  </Card.Root>
            </div>
            <div class="flex flex-col gap-y-2 items-center">
                <Card.Root class="w-[200px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-md">
                    <Card.Content class="w-full h-full flex flex-col justify-center items-center align-middle">
                        <div class="w-full h-full flex flex-col gap-y-2 justify-center items-center align-middle">
                            <p class="font-bold text-4xl">{team_score.final_score}</p>
                            <p class="text-xl">Points</p>
                        </div>
                    </Card.Content>
                  </Card.Root>
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
