<script>
    import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';


    export let data;
    // export let form;
    const team_members = data.props.team_members;
    const team_id = data.props.team_id;
    const leader_id = data.props.leader_id;
    const member_limit = data.props.contest_member_limit;
</script>

<h1 class="text-3xl font-bold mb-5">{data['team']['name'].toUpperCase()}</h1>


<div class="w-full md:w-1/2 py-10">


<h2 class="text-xl mb-5 font-semibold underline underline-offset-8"> Team members</h2>
{#each team_members as member,index}
    <a class="flex w-full" href="/users/1">
     <div class="flex">
        <div class="text-lg font-semibold cursor-pointer rounded-sm p-2">{index+1}.&nbsp;&nbsp;{member.username}</div> 
        {#if member.user_id == leader_id} 
            <div class=" align-middle font-semibold text-sm text-gray-300 dark:text-gray-500 cursor-pointer rounded-sm p-2">(leader)</div> 
        {/if}
    </a>
{/each}

{#if team_members.length < member_limit}
    <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
    <p id="standard_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">{data.props.error_message}</p>
    

    <form method="post" class="flex items-end space-x-5">
        <div class="flex-col w-full">
            <Label for="username" >+Add Member</Label>
            <Input type="text" id="username" name="username" class="border-slate-300 dark:bg-gray-700 dark:border-gray-600" required/>
        </div>
        <Button type="submit" >Add</Button>
    </form>
{/if}

{#if data['team'].leader}
-------------------
    team leader section.
    add password and delete team option here
-------------------
{/if}

</div>

