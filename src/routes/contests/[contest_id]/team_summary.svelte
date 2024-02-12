<script lang='ts'>
    import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from "$lib/components/ui/separator";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card";

    export let contest_id;
    let dataLoaded = false;
    $:keys = []
    let data = null;
    
    onMount(async () => {
        const response = await fetch(`/api/my_team/${contest_id}`);
        data = await response.json();
        console.log("hello in team summary page");
        console.log(data);
        keys = Object.keys(data.data);
        dataLoaded = true;
    });


</script>


    
{#if dataLoaded}
    <div class="p-20 ">
        
        <Card.Root class="">
            <Card.Header>
              <Card.Title><p class="flex justify-center text-xl sm:text-3xl underline font-bold mb-5 sm:mb-10">{data.name}</p></Card.Title>
            </Card.Header>
            <Card.Content>
                <Table.Root class="">
                    <Table.Header>
                    <Table.Row>
                        <Table.Head class="">#</Table.Head>
                        <Table.Head>Username</Table.Head>
                        <Table.Head class="">Score</Table.Head>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {#each keys as key,index}
                    <Table.Row class="">
                        
                            <Table.Cell class="font-medium">{index+1}</Table.Cell>
                            <Table.Cell>{data.data[key].name}</Table.Cell>
                            <Table.Cell class="">{data.data[key].score}</Table.Cell>
                    </Table.Row>
                    {/each}
                    </Table.Body>
                </Table.Root>
            </Card.Content>
          </Card.Root>           	
        

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
