<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import { Button } from '$lib/components/ui/button';
    import DropdownHint from '../../../Mycomponents/DropdownHint.svelte';
	export let data;
    const challenge = data.challenge;
    let solved_percentage = 0;
    let wrong_percentage = 0;
    if(data.challenge.verdicts.correct + data.challenge.verdicts.wrong > 0){
        solved_percentage = (data.challenge.verdicts.correct / (data.challenge.verdicts.correct  + data.challenge.verdicts.wrong) ) * 100;
        wrong_percentage = 100 - solved_percentage;
    }
</script>
<div class="flex flex-col gap-y-10 lg:flex-row justify-between py-10">
    <div id="problem_details_card" class=" float-left border-2 rounded-lg lg:w-1/2 border-black dark:border-gray-700">
        <div class="flex min-w-0 flex-col p-5">
            <div class="">
                <h1 class="text-2xl font-bold">{data.challenge.name}</h1>
            </div>
            <hr class="w-48 h-1 bg-black border-0 rounded dark:bg-gray-700">
            <div class="flex flex-col space-y-5">
                <div class="prose prose-lg dark:prose-invert py-5">
                    <SvelteMarkdown source={challenge.description} />
                </div>
        
                {#if challenge.attachments && challenge.attachments.length > 0}
                <div>
                    <h2 class="mb-3 text-xl">Attachments</h2>
                    <div class="flex flex-wrap gap-3">
                        {#each challenge.attachments as attachment (attachment)}
                            <Button variant="outline" class="border-primary overflow-hidden truncate overflow-ellipsis whitespace-nowrap">
                                <a href="{attachment.url}">{attachment.name}</a>
                            </Button>
                        {/each}
                    </div>
                </div>
                {/if}
        
                <h2 class="mb-3 text-xl">Author : <a class="font-bold text-blue-700" href="/user/{challenge.author.id}">{challenge.author.username}</a></h2>
            </div>
        </div>
    </div>
    <div class="w-full lg:w-1/2">
        <div id="problem_detail_tags" class="lg:px-20 block ">
            <div class="border-2 p-2 rounded-t-lg border-black dark:border-gray-700">Tags</div>
            <div class="space-y-5 p-2 rounded-b-lg border-x-2 border-b-2 border-black dark:border-gray-700">
                <div class="flex flex-wrap gap-3">
                    {#each challenge.tags as tags (tags)}
                        <div class="border text-center px-5 rounded border-black dark:border-gray-700 overflow-hidden truncate overflow-ellipsis whitespace-nowrap">
                            {tags}
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <div id="problem_detail_hints" class="lg:px-20 block mt-5">
            <div class="border-2 rounded-t-lg p-2 border-black dark:border-gray-700">Hints</div>
            <div class="space-y-5 rounded-b-lg p-2 border-x-2 border-b-2 border-black dark:border-gray-700">
                <div class="">
                    {#each challenge.hints as hint,index (hint)}
                        <DropdownHint  hint={hint} index={index+1} />
                    {/each}
                </div>
            </div>
        </div>
        <div class="w-full lg:px-20 block mt-5 flex mt-5 h-2.5 inline mb-4 ">
            <div class="bg-green-600 h-2.5 dark:bg-green-500" style="width: {solved_percentage}%"></div>
            <div class="bg-red-600 h-2.5 dark:bg-red-500" style="width: {wrong_percentage}%"></div>
            
        </div>
        <div class="flex items-center lg:px-20 block mt-5">
            <span class="flex w-3 h-3 me-3 bg-green-600 dark:bg-green-500"></span><span class="ml-2 mr-5">Solved</span>
            <span class="flex w-3 h-3 me-3 bg-red-600 dark:bg-red-500"></span><span class="mx-2">Wrong</span>
        </div>
        <div id="problem_detail_hints" class="lg:px-20 block mt-5">
            <div class="border-2 rounded-t-lg p-2 border-black dark:border-gray-700">Writeups</div>
            <div class="space-y-5 rounded-b-lg p-2 border-x-2 border-b-2 border-black dark:border-gray-700">
                <div class="">
                    {#each challenge.writeups as writeup,index (writeup)}
                        <a href="#" class="block font-medium text-blue-600 dark:text-blue-500 hover:underline"> {writeup.title} </a>
                    {/each}
                </div>
            </div>
        </div>
    </div>
    
</div>
