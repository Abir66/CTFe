<script>
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	export let data ;
	import { goto } from '$app/navigation';

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
		<div class="py-10 text-center text-2xl font-bold">No contests found</div>
	{:else}
		<Table.Root class="lg:text-md">
			<Table.Header>
				<Table.Row>
					<Table.Head>Team name</Table.Head>
					<Table.Head class="text-right">Members</Table.Head>
                    <!-- <Table.Head>Solves</Table.Head>
					<Table.Head class="text-right">Score</Table.Head> -->
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.teams as team (team.id)}
                    <Table.Row class="py-4 {team.status == 'banned' ? 'bg-red-500 bg-opacity-50 dark:bg-opacity-15' : ''}">
                        <Table.Cell class="py-4 font-medium">{team.name}</Table.Cell>
                        <Table.Cell class="text-right">{team.member_count}</Table.Cell>
                        <!-- <Table.Cell>{team.solve_count}</Table.Cell>
                        <Table.Cell class="text-right">{team.total_score}</Table.Cell> -->
                    </Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
