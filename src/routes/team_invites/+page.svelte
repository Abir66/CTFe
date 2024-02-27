<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import * as Card from "$lib/components/ui/card"; 
    import { goto } from "$app/navigation";
	import { each } from "chart.js/helpers";
    import { toast } from "svelte-sonner";

    export let data;
    let team_invites = data.team_invites;
  

    async function accept_invite(team_id){
        const user_id = data.user.id
        const contest_id = team_invites.find(invite => invite.team_id == team_id).contest_id
      
        const response = await fetch(`/api/team/${team_id}/accept_invite`, {
            method: 'POST',
            body: JSON.stringify({member_id:user_id})
        })
        const responseData = await response.json()
        console.log(responseData)
        if(responseData.success) {
            toast('Team invite Accepted Successfully')
            goto(`/contests/${contest_id}`)
            team_invites = team_invites.filter(invite => invite.team_id != team_id)
        }
        else {
            if(responseData.message) toast(responseData.message)        
            else toast("Something went wrong. Please try again.")
        }
    }

    async function reject_invite(team_id){
        const user_id = data.user.id
        const response = await fetch(`/api/team/${team_id}/remove_invite`, {
            method: 'POST',
            body: JSON.stringify({member_id:user_id})
        })
        const responseData = await response.json()
        console.log(responseData)
        if(responseData.success) {
            toast('Team invite Removed Successfully')
            team_invites = team_invites.filter(invite => invite.team_id != team_id)
        }
        else {
            if(responseData.message) toast(responseData.message)        
            else toast("Something went wrong. Please try again.")
        }
    }

</script>


<div class="flex flex-col w-full gap-y-5">
<h1 class="text-3xl font-bold my-5">Team Invites</h1>

{#if data.team_invites.length == 0}
    <p class="text-lg">No team invites</p>

{:else}
{#each team_invites as invite (invite)}
    <Card.Root class="w-full md:w-1/2 text-lg">
        <Card.Content class="py-5">
            <p class="text-xs mb-5 text-gray-500">{invite.invite_time}</p>

            <p><a href="/user/{invite.inviter_id}">{invite.inviter_username}</a>
                invited you to team
                <a href="/teams/{invite.team_id}">{invite.team_name}</a>
                for contest
                <a href="/contests/{invite.contest_id}">{invite.contest_name}</a>
            </p>

            <div class="mt-10 flex justify-end gap-5">
                <Button class="text-sm" on:click={()=>{accept_invite(invite.team_id)}}>Accept</Button>
                <Button class="text-sm" on:click={()=>{reject_invite(invite.team_id)}}>Reject</Button>
            </div>
        </Card.Content>
    </Card.Root>
{/each}
{/if}
</div>

<style>
    a {
        font-weight: bold;
        font-size: 1.25rem;
    }
    a:hover {
        text-decoration: underline;
    }

</style>