<script lang="ts">
    import * as Card from "$lib/components/ui/card"; 
    import { goto } from "$app/navigation";
    import * as Table from "$lib/components/ui/table";
    import * as d3 from "d3";
    import { Gear } from 'radix-icons-svelte'
    import { Button } from '$lib/components/ui/button';
    import {Exit} from 'radix-icons-svelte'
    import * as Dialog from "$lib/components/ui/dialog";
    import { toast } from "svelte-sonner";


    export let data;
    const contest_id = data.contest_id;
    const team_id = data.team_id;
    
    const category_solves_keys = Object.keys(data.category_solves);
    const members_id = Object.keys(data.team_members);
   
    

    let width = 850;
    let height = 850;
    let margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    let radius = Math.min(width, height) / 2 - margin;    
    const pi_data = data.category_solves;
    const key = Object.keys(pi_data);
    const color = d3.scaleOrdinal().domain(key).range(d3.schemeDark2);
    const pie = d3.pie().sort(null).value((d) => d[1]);
    const data_ready = pie(Object.entries(pi_data));
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 0.8);
    const outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

    const pi_data_verdict = data.verdict;
    console.log(pi_data_verdict);
    const key_verdict = Object.keys(pi_data_verdict);
    console.log(key_verdict);
    const color_verdict = d3.scaleOrdinal().domain(key_verdict).range(d3.schemeDark2);
    const pie_verdict = d3.pie().sort(null).value((d) => d[1]);
    const data_ready_verdict = pie_verdict(Object.entries(pi_data_verdict));
    const arc_verdict = d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 0.8);
    const outerArc_verdict = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);


    let leave_team_dialog_open = false;
    

    let leave_team_error = '';
    async function leave_team(){
        toast('Leaving the team...')
        leave_team_error  = '';
        const response = await fetch(`/api/team/${team_id}/leave`, {
            method: 'POST',
        })
        const responseData = await response.json()
        if(responseData.success) {
            toast('You have left the team successfully.')
            leave_team_dialog_open = false;
            location.reload();
        }
        else {
            if(responseData.message) leave_team_error  = responseData.message        
            else toast("Something went wrong. Please try again.")
        }
    }



</script>


<Dialog.Root bind:open={leave_team_dialog_open} onOpenChange={(open) => {if (!open) {leave_team_dialog_open = false;}}}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Leave Team</Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
            Are You sure you want to leave this team?
        </Dialog.Description>
           {#if leave_team_error }
                <p class="text-red-500">{leave_team_error }</p>
            {/if}
        <Dialog.Footer>
            <Button type="submit" variant="destructive" on:click={leave_team} >Yes, Leave</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>



{#if data.team_info.status == 'banned'}
    <div class="p-5  bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100 rounded-md">This team was banned from the contest</div>
{/if}

<div class=" gap-y-10 lg:flex-row justify-between py-10">

    <div class="flex mb-5">
        <h1 class="text-3xl font-bold mb-5">{data.team_info.name.toUpperCase()}</h1>
        {#if data.is_leader}
            <Button variant="ghost" on:click={()=>{goto(`/contests/${contest_id}/my_team`)}}><Gear class="scale-150"/></Button>
        {/if} 
        {#if data.is_member && !data.is_leader }
            <Button variant="ghost" on:click={()=>{leave_team_dialog_open = true}}><Exit class="scale-150"/></Button>
        {/if}   
    </div>
    <Table.Root class="lg:text-lg">
        <Table.Header>
            <Table.Row>
                <Table.Head>#</Table.Head>
                <Table.Head>Username</Table.Head>
                <Table.Head>Score</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each members_id as member_id,index}
                <Table.Row on:click={() => {}} class="hover:bg-slate-200 dark:hover:bg-slate-900">
                    <Table.Cell class="py-4 font-medium">{index+1}</Table.Cell>
                    <Table.Cell class="py-4 font-medium">{data.team_members[member_id].name}
                        {#if member_id == data.team_info.leader_id}
                        <span class="font-medium text-sm text-gray-400 dark:text-white py-4">(leader)</span>
                        {/if}
                    </Table.Cell>
                    <Table.Cell>{data.team_members[member_id].score}</Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>

<div class=" gap-y-10 lg:flex-row justify-between py-10">

    <h2 class="text-3xl font-bold mb-5">Solves</h2>
    <Table.Root class="lg:text-lg">
        <Table.Header>
            <Table.Row>
                <Table.Head>#</Table.Head>
                <Table.Head>Title</Table.Head>
                <Table.Head>Category</Table.Head>
                <Table.Head>Username</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each data.team_solves as data ,index}
                <Table.Row  class="">
                    <Table.Cell class="py-4 font-medium">{index+1}</Table.Cell>
                    <Table.Cell class="py-4 font-medium">{data.title}</Table.Cell>
                    <Table.Cell>{data.category}</Table.Cell>
                    <Table.Cell>{data.username}</Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>

<div class="lg:flex">
    <Card.Root class="w-full lg:w-1/2 m-5">
        <Card.Header>
          <Card.Title>Solved Categoris</Card.Title>
        </Card.Header>
        <Card.Content class="flex flex-row">
            <svg {width} {height} viewBox="{-width / 2}, {-height / 2}, {width}, {height}" style:max-width="100%" style:height="auto">
                <g class="chart-inner">
                  {#each data_ready as slice,index}
                    <path d={arc(slice)} fill={color(index)} />
                  {/each}
                </g>
            </svg>
            <Table.Root class="items-center w-1/2">
                <Table.Body>
                    {#each key as k,index}
                        <div class="flex">
                            <div class="w-4 h-4 rounded-full" style="background-color: {color(index)};"></div>
                            <p class="ml-2">{k}</p>
                        </div>
                    {/each}
                </Table.Body>
            </Table.Root>
        </Card.Content>
    </Card.Root>
    <Card.Root class="w-full lg:w-1/2 m-5">
        <Card.Header>
            <Card.Title>Verdict</Card.Title>
        </Card.Header>
        <Card.Content class="flex flex-row">
            <svg {width} {height} viewBox="{-width / 2}, {-height / 2}, {width}, {height}" style:max-width="100%" style:height="auto">
                <g class="chart-inner">
                  {#each data_ready_verdict as slice,index}
                    {#if key_verdict[index] == "Correct"}
                        <path d={arc_verdict(slice)} fill={'#22c55e'}  />
                    {:else}
                        <path d={arc_verdict(slice)} fill={'#ef4444'}  />
                    {/if}
                  {/each}
                </g>
            </svg>
            <Table.Root class="items-center w-1/2">
                <Table.Body>
                    {#each key_verdict as k,index}
                        <div class="flex">
                            {#if k == "Correct"}
                            <div class="w-4 h-4 rounded-full bg-green-500"></div>
                            <p class="ml-2">{k}</p>
                            {:else if k == "Wrong"}
                            <div class="w-4 h-4 rounded-full bg-red-500"></div>
                            <p class="ml-2">{k}</p>
                            {/if}
                        </div>
                    {/each}
                </Table.Body>
            </Table.Root>
        </Card.Content>
    </Card.Root>
    
</div>







