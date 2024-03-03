<script>
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	export let data ;
	import { goto } from '$app/navigation';

</script>

<form action="/contests/{data.contest_id}/organizer/participants" method="GET" class="mb-5 flex items-center py-4 text-xl  gap-x-5">
	<div class="w-full lg:w-1/2">
		<Input name="search_username" class="w-full" placeholder="Search user by name" type="text" />
	</div>
    <Button type="submit">Search</Button>
    {#if data.search_username!=''}
        <Button variant='outline' on:click={()=>{goto(`/contests/${data.contest_id}/organizer/participants`)}}>Clear</Button>
    {/if}
    
</form>

<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.participants.length == 0}
		<div class="py-10 text-center text-2xl font-bold">No participants found</div>
	{:else}
		<Table.Root class="lg:text-md">
			<Table.Header>
				<Table.Row>
					<Table.Head>Username</Table.Head>
					<Table.Head>Team</Table.Head>
                    <Table.Head>Solves</Table.Head>
					<Table.Head class="text-right">Score</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.participants as participant (participant.user_id)}
                    <Table.Row class="py-4">
                        <Table.Cell class="py-4 font-medium">{participant.username}</Table.Cell>
                        <Table.Cell>{participant.team_name}</Table.Cell>
                        <Table.Cell>{participant.solve_count}</Table.Cell>
                        <Table.Cell class="text-right">{participant.total_score}</Table.Cell>
                    </Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
