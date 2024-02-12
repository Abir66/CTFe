<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from "$app/stores";
    import { Separator } from "$lib/components/ui/separator";

    
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
    {#if data.contest.access == 'participant'}
        <a href="/contests/{contest_id}/my_team">My Team</a>
    {:else if data.contest.access == 'organizer'}
        <a href="/contests/{contest_id}/admin">Admin Panel</a>
    {/if}
</div>

<slot />


<style>
    .active{
        border-bottom: 2px solid black;
        padding-bottom: 8px;
    }
    
</style>
