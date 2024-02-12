<script lang="ts">
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Card from "$lib/components/ui/card";
    import SvelteMarkdown from 'svelte-markdown';
    import * as Table from "$lib/components/ui/table";
    export let data;
    import { goto } from '$app/navigation';
	import { redirect } from "@sveltejs/kit";
    
    console.log(data);

    let total_clarifications = data.clarifications.length;
    let title = "";
    function change_date_format(date){
        let d = new Date(date);
        return d.toDateString() + " " + d.toLocaleTimeString();
    }
</script>

<Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
      >+ Create a thread</Dialog.Trigger
    >
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Create a Thread</Dialog.Title>
      </Dialog.Header>
      <form method="POST" class=""  >
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-left">Title</Label>
            <Input name="title" id="name" bind:value={title} placeholder="enter thread title" class="col-span-3" />
            </div>
        </div>
      
        <Button type="submit" class="float-right">Create Thread</Button>
    </form>
    </Dialog.Content>
  </Dialog.Root>


{#if total_clarifications > 0}
    {#each data.clarifications as clarifications}
        <Card.Root class="my-4 hover:cursor-pointer hover:bg-slate-400 hover:dark:bg-gray-900" on:click={() => goto(`/contests/${data.contest_id}/clarifications/${clarifications.id}`)} >
            <Card.Header >
                <Card.Title class=" py-2">
                <div class="text-xl lg:flex">
                    <div class="div">{clarifications.title}&nbsp;</div>
                    <div class="text-sm text-gray-600 py-1 dark:text-gray-100 ">({change_date_format(clarifications.time)})</div>
                </div>
                <div class="text-sm font-thin text-gray-800 py-1 dark:text-gray-200">{clarifications.username}</div>    
            </Card.Title>
            </Card.Header>
        </Card.Root>
    {/each}
{:else}
        <h1 class="w-full font-bold text-2xl text-center">Create a thread</h1>

{/if}