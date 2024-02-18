<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from "$app/stores";
    import { Separator } from "$lib/components/ui/separator";
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { HamburgerMenu } from 'radix-icons-svelte';
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

    let showMenu = false;

    function toggleMenu() {
        showMenu = !showMenu;
    }

    let sections = [
        {name: "General", link: "/contests/"+contest_id+"/organizer/general"},
        {name: "Description", link: "/contests/"+contest_id+"/organizer/description"},
        {name: "Statistics", link: "/contests/"+contest_id+"/organizer/statistics"},
        {name: "Announcements", link: "/contests/"+contest_id+"/organizer/announcements"},
        {name: "Clarifications", link: "/contests/"+contest_id+"/organizer/clarifications"},
        {name: "Participants", link: "/contests/"+contest_id+"/organizer/participants"},
        {name: "Teams", link: "/contests/"+contest_id+"/organizer/teams"},
        {name: "Scoreboard", link: "/contests/"+contest_id+"/organizer/scoreboard"},
        {name: "Submissions", link: "/contests/"+contest_id+"/organizer/submissions"},
        {name: "Challenges", link: "/contests/"+contest_id+"/organizer/challenges"},
        {name: "Flag Mismatch", link: "/contests/"+contest_id+"/organizer/flag_mismatch"},
    ];

</script>

<div class="flex flex-col sm:flex-row justify-between">
    <div class="flex flex-row mt-5 py-2 gap-x-5">
        <div class="sm:hidden">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                  <Button builders={[builder]} variant="outline"><HamburgerMenu/></Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-56">
                  <DropdownMenu.Group>
                    {#each sections as section}
                        <DropdownMenu.Item>
                            <a href={section.link}>{section.name}</a>
                        </DropdownMenu.Item>
                    {/each}
                  </DropdownMenu.Group>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
        </div>
        
        <h1 class="scroll-m-20  text-3xl font-extrabold">
            {contest_name} 
        </h1>
    </div>
    
    

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


<div class="flex flex-row w-full">
    <div class="hidden sm:flex flex-col py-5 text-sm sm:text-base lg:text-xl mb-10 w-1/4 border-r">
        {#each sections as section}
            <a class="w-full section hover:bg-primary hover:text-secondary" href={section.link}>{section.name}</a>
        {/each}
    </div>
    <div class="w-full sm:px-5 py-5">
        <slot />
    </div>
</div>

<style>

    .section{
        padding: 10px;
        border-radius: 5px;
    }

</style>