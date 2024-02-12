<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    export let data;
    const contest_details = data.contest_details;
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import * as Card from "$lib/components/ui/card"; 
    import { goto } from "$app/navigation";
    import * as Dialog from '$lib/components/ui/dialog';
    import { Input } from "$lib/components/ui/input";

    $: start_time = new Date(contest_details.start_time).toUTCString();
    $: end_time =new Date(contest_details.end_time).toUTCString() ;

    let dialogueOpen = false;
    let submit_error = '';

    async function gotoContest(){
        submit_error = '';
        if(data.access.access != 'restricted') goto(`/contests/${contest_details.id}/challenges`);
        else dialogueOpen = true;
    }


    async function submit_private_contest_password(event){
        const formEl = event.target as HTMLFormElement
        const formData = new FormData(formEl)

        const response = await fetch(formEl.action, {
            method: 'POST',
            body: formData
        })
        const responseData = await response.json()
        console.log(responseData)

        if(responseData.success){
            dialogueOpen = false;
            goto(`/contests/${data.contest_id}/challenges`);
        }

        else{
            if(responseData.message) submit_error = responseData.message        
            else submit_error = 'Something went wrong. Please try again.' 
        }
        formEl.reset()
    }

</script>

{#if dialogueOpen}
	<Dialog.Root open
		onOpenChange={(open) => {if (!open) dialogueOpen = false;}}
	>
		<Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>Access Private Contest</Dialog.Title>
                <Dialog.Description>
                  Enter the contest password to get access to the private contest.
                </Dialog.Description>
              </Dialog.Header>
            {#if submit_error}
                <p class="text-center mt-2 text-md text-red-500 "><span class=" font-semibold">{submit_error}</span></p>
            {/if}
            <form  on:submit|preventDefault={submit_private_contest_password} method="POST" action="/api/contests/{data.contest_id}/getAccess" class="flex w-full gap-x-5"  >
                <div class="w-3/4">
                    <Input class="border-primary"
                        type="password"
                        name="password"
                        placeholder="Contest Password"
                    />
                </div>

                <Button class="w-1/4" type="submit">Submit</Button>
            </form>
            
			
		
        
        </Dialog.Content>
	</Dialog.Root>
{/if}



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
            {#each data.organizers as organizer (organizer.id)}
                <li class="mt-0 mb-2"><a class="font-semibold" href="/user/{organizer.id}">{organizer.username}</a></li>
            {/each}
        </ul>
    </div>

    </div>

    <div class="w-full lg:w-1/4 ">
        <div>
            {#if !(data.access.access == 'restricted' && (data.access.contest_status == 'ongoing' || data.access.contest_status == 'upcoming'))}
            <Button variant="outline" class="w-full py-6 text-lg border-primary mb-5" on:click={gotoContest}>Go to Contest</Button>
            {/if}
            {#if data.registration_eligibility}
                <Button class="w-full py-6 text-lg" on:click={() => goto(`/contests/${contest_details.id}/register`)}>Register</Button>
            {:else if data.already_registered}
                <Button variant="outline" class="w-full py-6 text-lg bg-green-500 hover:bg-green-500">Registered</Button>
            {/if}

        </div>

        <Card.Root class="my-10 px-5 py-3">
        <div >
            <h2 class="text-xl font-semibold py-3">
                Registered Teams <span class="text-lg font-normal">({data.team_count})</span>
            </h2>
            <Separator/>

            <ul class="py-5 prose dark:prose-invert">
                {#each data.team_shortlist as team (team.id)}
                    <li class="mt-0 "><a href="/contests/{contest_details.id}/team/{team.id}">{team.name}</a></li>
                {/each}
            </ul>

            <p class="text-right"><a href="/contests/{contest_details.id}/teams">Show Full List</a></p>
        </div>
    </Card.Root>
        
    </div>

</div>