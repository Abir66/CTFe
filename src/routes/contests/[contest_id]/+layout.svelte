<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from "$app/stores";
    import { Separator } from "$lib/components/ui/separator";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { goto } from '$app/navigation';

    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    export let data;
    const contest_name = data.contest.contest_name;
    const contest_id = data.contest_id;

    // calculate remaining time
    let contest_state = "";
    let message = "";

    if(new Date(data.contest.start_time) > new Date()){
        contest_state = "Upcoming";
        message = "Contest will start on " +data.contest.start_time;
    }
    else if(new Date(data.contest.end_time) < new Date()){
        contest_state = "Ended";
        message = "Contest has ended";
    }
    else{
        contest_state = "Running";
    }
    let end_time, time
    end_time = new Date(data.contest.end_time);
    time = new Date();
    
    $: timeDifference = Math.max(0,(end_time - time));
    $: hours = Math.floor(timeDifference / (1000 * 60 * 60));
	$: minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
	$: seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
    onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});


    let x=($page.url.pathname).split("/");
    
    let selected='';
    if($page.url.pathname.includes('challenges')){
        selected='challenges';
    }
    else if($page.url.pathname.includes('standings')){
        selected='standings';
    }
    else if($page.url.pathname.includes('clarifications')){
        selected='clarifications';
    }
    else if($page.url.pathname.includes('announcements')){
        selected='announcements';
    }

    let loaded = false;
    let keys = [];
    $: team_data = [{username: "loading",score:0}];
    let team_response = {};
    async function loadTeamInfo(){
            console.log("loading team info");
            if(!loaded){
                const response = await fetch(`/api/my_team/${contest_id}`);
                team_response = await response.json();
                team_data = team_response.data;
                console.log(team_response)
                loaded = true;
            }
            
            // hints = hints_response['hints'];
            // locked_hints = hints_response['locked_hints'];
            // hintLoaded = true;
        
	}



</script>
<div class="flex flex-col sm:flex-row justify-between">
    <h1 class="scroll-m-20 mt-5 py-2 text-3xl font-extrabold">
        {contest_name}
    </h1>
    {#if contest_state==="Running"}
        <div class="scroll-m-20 mt-5 py-2 sm:text-3xl font-bold float-right">
            <p>{hours}:{minutes}:{seconds}</p>
        </div>
    {:else}
        <div class="scroll-m-20 mt-5 py-2  font-bold float-right">
            <p>{message}</p>
        </div>
    {/if}
</div>



<Separator/>

<div class="flex justify-between py-5 text-sm sm:text-base lg:text-xl mb-10">
    <div class="space-x-3 sm:space-x-5">
        <a href="/contests/{contest_id}/challenges" class:active={selected==="challenges"} on:click={()=>{selected="challenges"}}>Challenges</a>
        <a href="/contests/{contest_id}/standings" class:active={selected==="standings"} on:click={()=>{selected="standings"}} >Standings</a>

        {#if data.contest.access == 'participant'}
            <a href="/contests/{contest_id}/clarifications" class:active={selected==="clarifications"} on:click={()=>{selected="clarifications"}}>Clarifications</a>
        {/if}
        <a href="/contests/{contest_id}/announcements" class:active={selected==="announcements"} on:click={()=>{selected="announcements"}}>Announcements</a>
    </div>
    <Dialog.Root>
        <Dialog.Trigger class="" on:click ={()=>{loadTeamInfo()}}>My Team</Dialog.Trigger>
        <Dialog.Content class="sm:max-w-[425px]">
          <Dialog.Header>
            <Dialog.Title>Team Name</Dialog.Title>
          </Dialog.Header>
          <div class="grid gap-4 py-4">

            
                {#if loaded}
                    {#each Object.keys(team_data) as key,index}
                        <div class="flex justify-between">
                            <p class="">{index+1}</p>
                            <p class="">{team_data[key].name}</p>
                            <p class="">{team_data[key].score}</p> 
                        </div>
                    {/each}
                {:else}
                <div class="flex flex-col space-y-5">
                    <Skeleton class="h-5 w-full" />
                    <Skeleton class="h-10 w-full" />
                    <Skeleton class="h-5 w-full" />
                </div>
                {/if}
            
          </div>
          <Dialog.Footer>
            <Button class="w-full" on:click={()=>{goto(`/contests/${contest_id}/my_team`)}}>Show Details</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    <!-- {#if data.contest.access == 'participant'}
        <a href="/contests/{contest_id}/my_team">My Team</a>
    {:else if data.contest.access == 'organizer'}
        <a href="/contests/{contest_id}/admin">Admin Panel</a>
    {/if} -->

</div>



<slot />


<style>
    .active{
        border-bottom: 2px solid black;
        padding-bottom: 8px;
    }
    
</style>
