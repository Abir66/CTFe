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
	// let pop_over_open = {}

	// for (let i = 0; i < data.teams.length; i++) {
	// 	pop_over_open[data.teams[i].id] = false
	// }


	let unban_user_error = '';
	let unban_user_dialog_open = false;
	let unban_user_id = -1;
	let unban_user_name = '';
	function show_unban_user_dialog(user_id) {
		unban_user_error = ''
		// pop_over_open[user_id] = false
		unban_user_id = user_id;
		unban_user_name = data.banned_users.find(user => user.user_id == user_id).username;
		unban_user_dialog_open = true;
	}


	async function unban_user(){
		unban_user_error = '';
		
		
		const response = await fetch(`/api/contests/${contest_id}/organizer/unban_user`, {
			method: 'POST',
			body: JSON.stringify({user_id: unban_user_id}),
		})
		const responseData = await response.json()
		if(responseData.success) {
            toast(`Removed ban from ${unban_user_name} Successfully`)
			data.banned_users = data.banned_users.filter(user => user.user_id != unban_user_id)
			unban_user_dialog_open = false;
        }
        else {
			console.log(responseData)
            if(responseData.message) unban_user_error = responseData.message        
            else toast("Something went wrong. Please try again.")
        }

		
	}

</script>
<div class="p-5 bg-slate-100 dark:bg-slate-800 rounded-md">List of uers who are banned and do not belongs to any team</div>
<form action="/contests/{data.contest_id}/organizer/banned_users" method="GET" class="mb-5 flex items-center py-4 text-xl  gap-x-5">
	<div class="w-full lg:w-1/2">
		<Input name="search_user_name" class="w-full" placeholder="Search user by name" type="text" />
	</div>
    <Button type="submit">Search</Button>
    {#if data.search_user_name!=''}
        <Button variant='outline' on:click={()=>{goto(`/contests/${data.contest_id}/organizer/banned_users`)}}>Clear</Button>
    {/if}
</form>

<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.banned_users.length == 0}
		<div class="py-10 text-center text-2xl font-bold">No Banned Users Found</div>
	{:else}
		<Table.Root class="lg:text-md">
			<Table.Header>
				<Table.Row>
					<Table.Head>Username</Table.Head>
					
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.banned_users as user (user.user_id)}
                    <Table.Row class="py-4 ">
                        <Table.Cell class="py-4 font-medium"><a href="/users/{user.id}" class="hover:underline">{user.username}</a></Table.Cell>
						<Table.Cell class="text-right font-medium">
							<Button type="submit" on:click = {()=>{show_unban_user_dialog(user.user_id)}}>Unban user</Button>
						</Table.Cell>
                    </Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>


<Dialog.Root bind:open={unban_user_dialog_open} onOpenChange={(open) => {if (!open) {unban_user_dialog_open = false;}}}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Unban User</Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
            Are You sure you want to unban - <span class="font-bold text-primary">{unban_user_name}</span>?
        </Dialog.Description>
           {#if unban_user_error}
                <p class="text-red-500">{unban_user_error}</p>
            {/if}
        <Dialog.Footer>
            <Button type="submit" variant="destructive" on:click={unban_user} >Yes, unban</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>