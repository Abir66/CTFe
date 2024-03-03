<script lang='ts'>
    import { onMount } from 'svelte';
    import SvelteMarkdown from 'svelte-markdown';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import * as Select from "$lib/components/ui/select";
    import { toast } from "svelte-sonner";

	import { Separator } from "$lib/components/ui/separator";
    import { Skeleton } from "$lib/components/ui/skeleton";
	import { invalidateAll } from '$app/navigation';
    import * as Accordion from "$lib/components/ui/accordion";
    import * as Table from '$lib/components/ui/table';
	import { goto } from '$app/navigation';
	import * as Popover from "$lib/components/ui/popover";
	import * as Dialog from "$lib/components/ui/dialog";
    import { Switch } from "$lib/components/ui/switch";
    import { Progress } from "$lib/components/ui/progress";
    
   
    export let data;

    $: user_submissions = data.user_submissions;
    $: challenge = data.problem;
    let submit_error = '';
    let flag = '';
    let verdict = '';
    

    function formatTime(inputTimeString) {
        // Parse the input time string into a datetime object
        const utcTime = new Date(inputTimeString);

        // Create a new Date object with Bangladesh time zone (GMT+6)
        const bdTime = new Date(utcTime.getTime() + (6 * 60 * 60 * 1000));

        // Format the date according to the desired format
        return bdTime.toLocaleDateString("en-BD", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }) + " " + bdTime.toLocaleTimeString("en-BD", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        });
    }



    async function submitFlag(event){

        if(!flag){
            submit_error = 'Flag can not be empty'
            return
        }

        toast("Submitting Flag...")
        submit_error = ''
        const formEl = event.target as HTMLFormElement
        const response = await fetch(`/api/public_problem/submit_flag`, {
            method: 'POST',
            body: JSON.stringify({
                problem_id: challenge.id,
                variation_id: selected_variation_id.value,
                flag: flag
            })
        })

        const responseData = await response.json()

        if(responseData.success) {
            const data = responseData.data
            if(data.submitted){
                toast('Flag Submitted')
                verdict = data.verdict

                const new_submission = {
                    id : data.id,
                    flag: flag,
                    time: formatTime(data.time),
                    problem_id: data.problem_id,
                    verdict: data.verdict,
                    variation_id: selected_variation_id.value,
                    variation_name: selected_variation_id.label
                }

                user_submissions = [new_submission, ...user_submissions]
            }
            else{
                if(data.message) submit_error = data.message        
                else toast("Something went wrong. Please try again.")
            }
        }
        else {
            if(responseData.message) submit_error = responseData.message        
            else toast("Something went wrong. Please try again.")
        }
    
        formEl.reset()
    }

    let selected_variation_id = {
        value : data.problem.variation_id,
        label : data.problem.variation_name
    } 
   
    async function change_variation(selected){
        selected_variation_id = selected
        toast("Loading...")
        goto(`/problems/${challenge.id}/?variation_id=${selected_variation_id.value}`)
    }


</script>

<div class="flex flex-col w-full lg:flex-row justify-between">
    <div class="flex min-w-0 w-full lg:w-1/2 flex-col p-5">

            <div class="flex w-full space-x-5">
                <h1 class="text-3xl font-bold">{challenge.title}</h1>

                <Select.Root bind:selected={selected_variation_id} onSelectedChange={(selected) =>{change_variation(selected)}}>
                    <Select.Trigger class="w-[180px]">
                      <Select.Value placeholder="Variations" />
                    </Select.Trigger>
                    <Select.Content>
                    {#each data.variations as variation (variation.id)}
                        <Select.Item value={variation.id}>{variation.variation_name}</Select.Item>
                    {/each}
                    </Select.Content>
                </Select.Root>
            </div>
            

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

                
                {#if verdict == 'correct'}
                    <p class="p-3 text-center rounded mt-2 text-md bg-green-500 dark:bg-green-600"><span class=" font-semibold">Correct</span></p>
                {:else if verdict == 'incorrect'}
                    <p class="p-3 text-center mt-2 text-md bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100 rounded-md"><span class=" font-semibold">Incorrect</span></p>
                {:else if submit_error}
                    <p class="text-red-500">{submit_error}</p>
                {/if}

                <form  on:submit|preventDefault={submitFlag} class="flex w-full gap-x-5"  >
                    <div class="w-3/4">
                        <Input class="border-primary"
                            type="text"
                            name="flag"
                            placeholder="Flag"
                            bind:value={flag}
                        />
                    </div>
                    <Button class="w-1/4" type="submit">Submit</Button>
                </form>
            </div>
    </div>



    <div class="flex min-w-0 w-full lg:w-1/3  flex-col p-5 gap-y-10">
        <h2 class="mb-3">Author : <a class=" text-blue-700" href="/user/{challenge.author_id}">{challenge.author_name}</a></h2>      
    
        <div class="w-full">
            <h2 class="text-xl font-bold border-b-4">Hints</h2>      
        
            <Accordion.Root class="w-full">
                {#each data.hints as hint, index (hint.id)}
                    <Accordion.Item value={"hint" + index}>
                    <Accordion.Trigger>Hint {index + 1}</Accordion.Trigger>
                    <Accordion.Content>{hint.description}</Accordion.Content>
                    </Accordion.Item>
                {/each}
            </Accordion.Root>
        </div>


        {#if user_submissions && user_submissions.length > 0}
            <div class="w-full">
                <h2 class="text-xl font-bold border-b-4">My Submissions</h2>
                
                <div class="flex my-5 space-x-4">
                    <!-- correct submissions -->
                    <p class="text-left">{user_submissions.filter(submission => submission.verdict === 'correct').length} Correct</p>
                    <Progress value={user_submissions.filter(submission => submission.verdict === 'correct').length} max={user_submissions.length} class="w-[60%] m-auto" />
                    <p class="text-right">{user_submissions.filter(submission => submission.verdict === 'incorrect').length} Incorrect</p>
                </div>
                
                
                <Table.Root class="lg:text-md">
                    <Table.Body>
                        {#each user_submissions as submission (submission)}
                            <Table.Row class="py-4">

                                <Table.Cell class="py-4 font-medium">{submission.time}</Table.Cell>
                                <Table.Cell class="">{submission.verdict}</Table.Cell>

                                <Popover.Root>
                                    <Popover.Trigger class="py-4">
                                      ...
                                    </Popover.Trigger>
                                    <Popover.Content class="w-60">
                                        <div class="flex flex-col gap-y-5">
                                            <div>
                                                <div class="text-sm font-bold">Submitted Flag</div>
                                                <div>{submission.flag}</div>
                                            </div>
        
                                            <div>
                                                <div class="text-sm font-bold">Verdict</div>
                                                <div>{submission.verdict}</div>
                                            </div>
        
                                            <div>
                                                <div class="text-sm font-bold">Variation</div>
                                                <div>{submission.variation_name}</div>
                                            </div>
        
                                        </div>
                                    </Popover.Content>
                                  </Popover.Root>


                            </Table.Row>
                        {/each}
                    </Table.Body>
                </Table.Root>
            </div>

        {/if}


        


    </div>
</div>
        


