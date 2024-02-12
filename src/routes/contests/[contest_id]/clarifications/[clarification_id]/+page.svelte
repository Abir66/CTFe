<script>
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
	import { goto } from "$app/navigation";
    export let data;
    let title = "";
    console.log(data);
    function change_date_format(date){
        let d = new Date(date);
        return d.toDateString() + " " + d.toLocaleTimeString();
    }
</script>
{#if data.thread_details != null}
    <div class="px-5">
        <div class="text-2xl lg:flex font-bold">{data.thread_details[0].title}&nbsp;<div class="text-sm py-2 text-gray-300 dark:text-gray-700">({change_date_format(data.thread_details[0].time)})</div></div>
        <div class="text-lg py-3 flex font-thin">Thread Creator: <div class = "pl-3" >{data.thread_details[0].username}</div></div>
            {#each data.thread_chat as chat}
                <Card.Root class="my-2">
                    <Card.Header>
                    <Card.Title ><span class="hover:underline hover:cursor-pointer" on:click={()=>{goto(`/user/${chat.user_id}`)}}>{chat.username}</span></Card.Title>
                    <Card.Description>{change_date_format(chat.time)}</Card.Description>
                    </Card.Header>
                    <Card.Content>
                    {chat.text}
                    </Card.Content>
                </Card.Root>
            {/each}
    </div>
        
    
{:else}
    <h1>Clarification no</h1>
{/if}
<form method="POST" action="?/sendQues" class="px-5"  >
    <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center">
        <Input name="chat" id="name" bind:value={title} placeholder="enter questions" class="col-span-3" />
        <Button type="submit" class="grid-cols-1 ml-4">Send</Button>
    </div>
        
    </div>
</form>
