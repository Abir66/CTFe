<script>
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	export let data ;
	import { goto } from '$app/navigation';
	import * as Popover from "$lib/components/ui/popover";
	import * as Select from "$lib/components/ui/select";
	import * as Dialog from "$lib/components/ui/dialog";
    import { Separator } from "$lib/components/ui/separator";
    import { Switch } from "$lib/components/ui/switch";
    import { toast } from "svelte-sonner";

	const contest_id = data.contest_id;
	let pop_over_open = {}

	for (let i = 0; i < data.teams.length; i++) {
		pop_over_open[data.teams[i].id] = false
	}


	let delete_team_error = '';
	let delete_team_dialog_open = false;
	let delete_team_id = -1;
	let delete_team_name = '';
    function show_delete_team_dialog(team_id) {
		delete_team_error = ''
		pop_over_open[team_id] = false
		delete_team_id = team_id;
		delete_team_name = data.teams.find(team => team.id == team_id).name;
        delete_team_dialog_open = true;
    }


    async function delete_team(){
        delete_team_error = '';
        const response = await fetch(`/api/contests/${contest_id}/organizer/delete_team`, {
            method: 'POST',
			body: JSON.stringify({team_id: delete_team_id}),
        })
        const responseData = await response.json()
        if(responseData.success) {
            toast(`Team ${delete_team_name} Deleted Successfully`)
			data.teams = data.teams.filter(team => team.id != delete_team_id)
			delete_team_dialog_open = false;
        }
        else {
            if(responseData.message) delete_team_error = responseData.message        
            else toast("Something went wrong. Please try again.")
        }
    }





	let ban_team_error = '';
	let ban_team_dialog_open = false;
	let ban_team_id = -1;
	let ban_team_name = '';
	let ban_team_status = '';
    function show_ban_team_dialog(team_id, status) {
		console.log(team_id, status)
		ban_team_error = ''
		pop_over_open[team_id] = false
		ban_team_id = team_id;
		ban_team_status = status;
		ban_team_name = data.teams.find(team => team.id == team_id).name;
        ban_team_dialog_open = true;
    }


    async function ban_team(){
        ban_team_error = '';

		const team_status = ban_team_status == 'banned' ? 'ban' : 'unban'			

        const response = await fetch(`/api/contests/${contest_id}/organizer/set_team_ban`, {
            method: 'POST',
			body: JSON.stringify({team_id: ban_team_id, team_status: team_status}),
        })
        const responseData = await response.json()
        if(responseData.success) {
            if(ban_team_status == 'banned') toast(`Team ${delete_team_name} Banned Successfully`)
			else toast(`Team ${delete_team_name} Unbanned Successfully`)
			data.teams = data.teams.map(team => {
				if(team.id == ban_team_id) team.status = ban_team_status
				return team
			})
			ban_team_dialog_open = false;
        }
        else {
            if(responseData.message) ban_team_error = responseData.message        
            else toast("Something went wrong. Please try again.")
        }
    }

</script>

<form action="/contests/{data.contest_id}/organizer/teams" method="GET" class="mb-5 flex items-center py-4 text-xl  gap-x-5">
	<div class="w-full lg:w-1/2">
		<Input name="search_team_name" class="w-full" placeholder="Search team by name" type="text" />
	</div>
    <Button type="submit">Search</Button>
    {#if data.search_team_name!=''}
        <Button variant='outline' on:click={()=>{goto(`/contests/${data.contest_id}/organizer/teams`)}}>Clear</Button>
    {/if}
</form>

<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.teams.length == 0}
		<div class="py-10 text-center text-2xl font-bold">No teams found</div>
	{:else}
		<Table.Root class="lg:text-md">
			<Table.Header>
				<Table.Row>
					<Table.Head>Team name</Table.Head>
					<Table.Head class="">Members</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.teams as team (team.id)}
                    <Table.Row class="py-4 {team.status == 'banned' ? 'bg-red-200 text-red-700 dark:bg-red-800 dark:text-red-100' : ''}">
                        <Table.Cell class="py-4 font-medium"><a href="/teams/{team.id}" class="hover:underline">{team.name}</a></Table.Cell>
                        <Table.Cell class="">{team.member_count}</Table.Cell>

						<Popover.Root bind:open={pop_over_open[team.id]} onOpenChange={(open) => {pop_over_open[team.id] = open}}>
							<Popover.Trigger class="py-4">
							  ...
							</Popover.Trigger>
							<Popover.Content class="w-60">
								
								<div class="flex flex-col gap-y-2">
									<Button variant="ghost" type="submit" class="w-full justify-start hover:invert transition ease-in-out" 
									on:click = {()=>{show_delete_team_dialog(team.id)}}>Delete Team</Button>
									{#if team.status == 'banned'}
										<Button variant="ghost" type="submit" class="w-full justify-start hover:invert transition ease-in-out" on:click = {()=>{show_ban_team_dialog(team.id, "unbanned")}}>Unban Team</Button>
									{:else}
										<Button variant="ghost" type="submit" class="w-full justify-start hover:invert transition ease-in-out" on:click = {()=>{show_ban_team_dialog(team.id, "banned")}} >Ban Team</Button>
									{/if}
									
								</div>
							</Popover.Content>
						  </Popover.Root>
                    </Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>




<Dialog.Root bind:open={delete_team_dialog_open} onOpenChange={(open) => {if (!open) {delete_team_dialog_open = false;}}}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Delete Team</Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
            Are You sure you want to delete the team - <span class="font-bold text-primary">{delete_team_name}</span>? This action cannot be undone.
        </Dialog.Description>
           {#if delete_team_error}
                <p class="text-red-500">{delete_team_error}</p>
            {/if}
        <Dialog.Footer>
            <Button type="submit" variant="destructive" on:click={delete_team} >Yes, Delete</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>



<Dialog.Root bind:open={ban_team_dialog_open} onOpenChange={(open) => {if (!open) {ban_team_dialog_open = false;}}}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>{ban_team_status.charAt(0).toUpperCase() + ban_team_status.slice(1)} Team</Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
            Are You sure you want to {ban_team_status} the team - <span class="font-bold text-primary">{delete_team_name}</span>?
        </Dialog.Description>
           {#if ban_team_error}
                <p class="text-red-500">{ban_team_error}</p>
            {/if}
        <Dialog.Footer>
            <Button type="submit" variant="destructive" on:click={ban_team} >Yes, {ban_team_status}</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>