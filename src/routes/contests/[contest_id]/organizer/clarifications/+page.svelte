<script>
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Card from "$lib/components/ui/card";
    import { goto } from '$app/navigation';

    export let data;

    let total_clarifications = data.clarifications.length;
    let title = "";
    function change_date_format(date){
        let d = new Date(date);
        return d.toDateString() + " " + d.toLocaleTimeString();
    }
</script>

{#if total_clarifications > 0}
    {#each data.clarifications as clarifications}
        <Card.Root class="my-4"  >
            <Card.Header >
                <Card.Title class=" py-2">
                <div class="text-xl lg:flex" on:click={(e) => goto(`/contests/${data.contest_id}/organizer/clarifications/${clarifications.id}`)}>
                    {#if clarifications.status}
                        <div class="divhover:cursor-pointer hover:bg-slate-400 hover:dark:bg-gray-900 hover:cursor-pointer">{clarifications.title}&nbsp;</div>
                    {:else}
                        <div class="divhover:cursor-pointer text-gray-500 hover:bg-slate-400 hover:dark:bg-gray-900 hover:cursor-pointer">{clarifications.title}&nbsp;</div>
                    {/if}
                    <div class="text-sm text-gray-600 py-1 dark:text-gray-100 ">({change_date_format(clarifications.time)})</div>
                </div>
                <!-- <div class="text-sm font-thin text-gray-800 py-1 dark:text-gray-200 hover:underline hover:cursor-pointer" on:click={(e)=>{goto(`/user/${clarifications.user_id}`)}} >{clarifications.username}</div>  -->
                <a class="text-sm font-thin text-gray-800 py-1 dark:text-gray-200 hover:underline hover:cursor-pointer" href="/user/{clarifications.user_id}" >{clarifications.username}</a>
                         
            </Card.Title>
            </Card.Header>
        </Card.Root>
    {/each}
{:else}
    <h1 class="w-full font-bold text-2xl text-center">No Clarifications</h1>

{/if}