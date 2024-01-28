<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    export let data;
    const contest_details = data.contest_details;
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import * as Card from "$lib/components/ui/card"; 
    import { goto } from "$app/navigation";
    const teamRegister = () => {
        goto(`/contests/${contest_details.id}/register`);
    }
     let start_time;
     let end_time;
$: start_time = new Date(contest_details.start_time).toUTCString();
$: end_time =new Date(contest_details.end_time).toUTCString() ;
</script>

<div class="flex flex-col gap-y-10 lg:flex-row justify-between py-10">

    <div class="w-full lg:w-3/4 flex-shrink-0">
    <h2 class="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
        {contest_details.contest_name}
    </h2>

    <div class="text-xl space-y-5 mt-10">
        <p>{start_time}    -    {end_time}</p>
        <p>Format : {contest_details.format}</p>
    </div>

    
    <div class="prose prose-lg dark:prose-invert py-10">
        <SvelteMarkdown source={contest_details.description}/>
    </div>

    <div class="prose prose-lg dark:prose-invert py-10">
        <h2>Organizers:</h2>
        <ul>
            {#each contest_details.organizers as organizer (organizer.id)}
                <li class="mt-0 mb-2"><a class="font-semibold" href="/user/{organizer.id}">{organizer.username}</a></li>
            {/each}
        </ul>
    </div>

    </div>

    <div class="w-full lg:w-1/4 ">
        <div>
            <Button variant="outline" class="w-full py-6 text-lg border-primary mb-5">Go to Contest</Button>
            <Button class="w-full py-6 text-lg" on:click={() => teamRegister()}>Register</Button>
        </div>

        <Card.Root class="my-10 px-5 py-3">
        <div >
            <h2 class="text-xl font-semibold py-3">
                Registered Teams <span class="text-lg font-normal">({contest_details.team_shortlist.length})</span>
            </h2>
            <Separator/>

            <ul class="py-5 prose dark:prose-invert">
                {#each contest_details.team_shortlist as team (team.id)}
                    <li class="mt-0 "><a href="/contests/{contest_details.id}/team/{team.id}">{team.name}</a></li>
                {/each}
            </ul>

            <p class="text-right"><a href="/contests/{contest_details.id}/teams">Show Full List</a></p>
        </div>
    </Card.Root>
        
    </div>

</div>