<script lang='ts'>
    import { onMount } from 'svelte';
    import SvelteMarkdown from 'svelte-markdown';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Tabs from "$lib/components/ui/tabs";
	import { Separator } from "$lib/components/ui/separator";
    import { Skeleton } from "$lib/components/ui/skeleton";
	import { invalidateAll } from '$app/navigation';
    import * as Select from "$lib/components/ui/select";
    import { toast } from "svelte-sonner";
    import * as Table from '$lib/components/ui/table';


    export let challenge_id;
    let show = 'challenge';
    let challenge;
    let challenge_loaded = false;
    let submit_error = '';
    let verdict = '';
    let all_variations;


    let selected_variation_id
    let challenge_error = '';

    // ---------------- challenge ----------------------------
    onMount(async () => {
        const response = await fetch(`/api/challenges/${challenge_id}`)
        const data = await response.json();
        console.log(data);
        challenge = data.problem;

        
        if(data.problem){
            selected_variation_id = {
                value : data.problem.variation_id,
                label : data.problem.variation_name
            } 
        }
        else{
            challenge_error = data.error ? data.error : "Something went wrong"
        }

        all_variations = data.all_variations;

        challenge_loaded = true;
        console.log(challenge)
    });


    async function change_variation(selected){
        selected_variation_id = selected
        challenge_loaded = false;
        const response = await fetch(`/api/challenges/${challenge_id}/get_specific_variation`,  {
            method: 'POST',
            body: JSON.stringify({variation_id : selected_variation_id.value })
        })

        const data = await response.json();
        console.log(data);
        challenge = data.problem;
       
        selected_variation_id = {
            value : data.problem.variation_id,
            label : data.problem.variation_name
        } 

        all_variations = data.all_variations;

        challenge_loaded = true;
        console.log(challenge)
    }

    

    async function submitFlag(event){
        verdict = ''
        const formEl = event.target as HTMLFormElement
        const data = new FormData(formEl)
        data.append('variation_id', selected_variation_id.value)

        const response = await fetch(formEl.action, {
            method: 'POST',
            body: data
        })
        const responseData = await response.json()
        
        if(responseData.error) submit_error = responseData.error
        else submit_error = ''
        
        if(responseData.submitted){
            if(!isNaN(challenge.attempt_count)) challenge.attempt_count += 1;
            challenge = challenge;
        }

        if(responseData.verdict) {
            verdict = responseData.verdict
            if(verdict == 'correct') invalidateAll()
        }
    
        formEl.reset()
    }

    //  ------------------- hint ----------------------------
    let hints : any[] = [];
    let locked_hints : any[] = [];
    let hintLoaded = false;
    let unlock_message = '';
    

	async function showHints(){
        show = 'hints'
        if(!hintLoaded){
            const response = await fetch(`/api/challenges/${challenge_id}/hints`);
            const hints_response = await response.json();
            console.log(hints_response)
            hints = hints_response['hints'];
            locked_hints = hints_response['locked_hints'];
            hintLoaded = true;
        }
	}

    async function unlock_hint(hint_id){
        console.log("here")
        const response = await fetch(`/api/challenges/${challenge_id}/hints/${hint_id}/unlock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }); 

        const data = await response.json();
        if(!data.success) unlock_message = data.message;
        else{
            unlock_message = '';
            hints.push({
                id: data.hint.unlocked_id,
                description: data.hint.unlocked_description
            });

            hints = hints
            locked_hints = locked_hints.filter(hint => hint.id != hint_id);
        }
    }


    async function showChallenge(){
		show = 'challenge';
	}




    // --------------- solves ---------------------
    let solves : any[] = [];
    let solveLoaded = false;
    let solve_error = '';

	async function showSolves(){
        show = 'solves';
        if(!solveLoaded){
            const response = await fetch(`/api/challenges/${challenge_id}/solves`);
            const solves_response = await response.json();
            
            if(solves_response.success) {
                solves = solves_response.data;
            }
            else {
                solve_error = "Something went wrong"
            }
            solveLoaded = true;
            console.log(solves)

        }
	}


</script>

<Tabs.Root value="challenge" class="flex min-w-0 flex-col items-center p-5">
    <Tabs.List class="grid w-full grid-cols-3">
    <Tabs.Trigger value="challenge" on:click={showChallenge}>Challenge</Tabs.Trigger>
    <Tabs.Trigger value="hints" on:click={showHints}>Hints</Tabs.Trigger>
    <Tabs.Trigger value="solves" on:click={showSolves}>solves</Tabs.Trigger>
    </Tabs.List>
</Tabs.Root>


{#if show == 'challenge'}
    <div class="flex min-w-0 w-full flex-col items-center p-5">
        {#if !challenge_loaded}
                <div class="flex flex-col space-y-5">
                    <Skeleton class="h-20 w-[400px]" />
                    <Skeleton class="h-20 w-[400px]" />
                    <Skeleton class="h-10 w-[400px]" />
                </div>  
            
        {:else}
            {#if challenge_error}
                <div class="flex justify-center items-center h-96">
                    <h1 class="text-3xl font-bold">{challenge_error}</h1>
                </div>
            {:else}

            
        
            <div class="text-center">
                <h1 class="text-2xl font-bold">{challenge.title}</h1>
                <h2 class="text-2xl">{challenge.score}</h2>
            </div>

            {#if all_variations}
                <div class="text-center">
                    <Select.Root bind:selected={selected_variation_id} onSelectedChange={(selected) =>{change_variation(selected)}}>
                        <Select.Trigger class="w-[180px]">
                            <Select.Value placeholder="Variations" />
                        </Select.Trigger>
                        <Select.Content>
                        {#each all_variations as variation (variation.id)}
                            <Select.Item value={variation.id}>{variation.variation_name}</Select.Item>
                        {/each}
                        </Select.Content>
                    </Select.Root>
                    
                </div>
            {/if}

            <div class="flex flex-col space-y-5">
                <div class="prose prose-lg dark:prose-invert py-5">
                    <SvelteMarkdown source={challenge.description ? challenge.description : ''} />
                </div>

                {#if challenge.attachments && challenge.attachments.length > 0}
                <div>
                    <h2 class="mb-3">Attachments</h2>
                    <div class="flex flex-wrap gap-3">
                        {#each challenge.attachments as attachment (attachment)}
                            <Button variant="outline" class="border-primary overflow-hidden truncate overflow-ellipsis whitespace-nowrap">
                                <a target="_blank" href="{attachment.link}">{attachment.file_name}</a>
                            </Button>
                        {/each}
                    </div>
                </div>
                {/if}

                <h2 class="mb-3">Author : <a class=" text-blue-700" href="/user/{challenge.author_id}">{challenge.author_name}</a></h2>
                
                {#if challenge.attempt_count!= null}                    
                    <div class="text-center">
                        <p class="text-xl ">{challenge.attempt_count}/{challenge.max_attempts} Attemps</p>
                    </div>
                {/if}

                
                {#if verdict == 'correct'}
                    <p class="p-3 text-center rounded mt-2 text-md bg-green-500 dark:bg-green-600"><span class=" font-semibold">Correct</span></p>
                {:else if verdict == 'incorrect'}
                    <p class="p-3 text-center rounded mt-2 text-md text-white bg-red-600 dark:bg-red-700"><span class=" font-semibold">Incorrect</span></p>
                {:else if submit_error}
                    <p class="p-3 text-center rounded mt-2 text-md text-white bg-red-600 dark:bg-red-700"><span class=" font-semibold">{submit_error}</span></p>
                {/if}

                
                <form  on:submit|preventDefault={submitFlag} method="POST" action="/api/challenges/{challenge_id}" class="flex w-full gap-x-5"  >
                    <input type="hidden" name="__superform_id"/>
                    <div class="w-3/4">
                        <Input class="border-primary"
                            type="text"
                            name="flag"
                            placeholder="Flag"
                        />
                    </div>

                    <Button class="w-1/4" type="submit">Submit</Button>
                </form>

            </div>

            {/if}

        {/if}
    </div>
    


    {:else if show == 'hints'}
    <div class="flex min-w-0 flex-col items-center p-5 overflow-y-auto max-h-[70vh] no-scrollbar">

        {#if !hintLoaded}
            <div class="flex flex-col space-y-5">
                <Skeleton class="h-20 w-[400px]" />
                <Skeleton class="h-20 w-[400px]" />
                <Skeleton class="h-10 w-[400px]" />
            </div>  
        
        {:else}
            <div class="flex flex-col space-y-5">
                {#each hints as hint, index (hint.id)}
                    <div class="prose prose-lg dark:prose-invert">
                        <p class="font-bold text-sm">Hint {index + 1}</p>
                        <SvelteMarkdown source={hint.description ? hint.description : ''} />
                    </div>
                    <Separator/>
                {/each}
                {#if unlock_message}
                    <p class="font-semi bg-red-200  text-red-500 p-2 rounded-md w-full">{unlock_message}</p>
                {/if}
                
                {#if locked_hints && locked_hints.length > 0}
                    {#each locked_hints as hint, index (hint)}
                        <div class="prose prose-lg dark:prose-invert">
                            <Button class="p-5 text-md w-full" on:click={() => {unlock_hint(hint.id)}}>Unlock hint {hints.length + index + 1} for {hint.penalty_score} points?</Button>
                        </div>
                    {/each}
                {/if}
            </div>
        {/if}
        
    </div>

{:else if show == 'solves'}
<div class="flex min-w-0 flex-col items-center p-5 overflow-y-auto max-h-[70vh] no-scrollbar">

    {#if !solveLoaded}
        <div class="flex flex-col space-y-5">
            <Skeleton class="h-20 w-[400px]" />
            <Skeleton class="h-20 w-[400px]" />
            <Skeleton class="h-10 w-[400px]" />
        </div>  
    {:else}
        <!-- in the middle print solves.length -->
        {#if solves.length == 0}
            <div class="flex justify-center items-center ">
                <h1 class="text-xl font-bold">No solves yet</h1>
            </div>

        {:else}
            <div class="flex justify-center items-center ">
                <h1 class="text-xl font-bold">{solves.length} Solves</h1>
            </div>


        <div class="w-full">
            <Table.Root class="lg:text-md">
                <Table.Header>
                    <Table.Row>
                        <Table.Head>Team name</Table.Head>
                        
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each solves as solve (solve)}
                        <Table.Row class="py-4 ">
                            <Table.Cell class="py-4 font-medium"><a href="/teams/{solve.team_id}" class="hover:underline">{solve.team_name}</a></Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </div>
        {/if}
    {/if}
    
</div>


{/if}


        


