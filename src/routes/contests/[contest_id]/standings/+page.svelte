<script>
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { Switch } from "$lib/components/ui/switch";


	export let data ;
	let show_banned = data.show_banned;
	let search_team_name = data.search_team_name;


	const team_id = data.contest.team_id ? data.contest.team_id : '-1';
	

	async function toggle_show_banned(){
		show_banned = !show_banned;
		submitSearch()
	}

	async function submitSearch(){
		goto(`/contests/${data.contest_id}/scoreboard?search_team_name=${search_team_name}&show_banned=${show_banned}`);
	}

	async function clear(){
		search_team_name = '';
		submitSearch()
	}
	
</script>

<form action="/contests/{data.contest_id}/scoreboard" method="GET" class="mb-5 w-full flex flex-col gap-y-5 lg:flex-row lg:gap-y-0 lg:justify-between py-4 text-xl" on:submit|preventDefault={submitSearch}>
	<div class="w-full flex gap-x-5">
		<div class="w-3/4">
			<Input name="search_team_name" class="w-full" placeholder="Search team by name" type="text" bind:value={search_team_name} />
		</div>
		<Button type="submit">Search</Button>
		{#if data.search_team_name!=''}
			<Button variant='outline' on:click={clear}>Clear</Button>
		{/if}
	</div>
	<div class="w-full flex gap-x-2 lg:justify-end">
		<label for="show_banned_toggle" class="text-sm">Show Banned Teams</label><br>
		<Switch id="show_banned_toggle" bind:checked={show_banned} onCheckedChange={toggle_show_banned} />
	</div>
</form>



<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.teams.length == 0}
		<div class="py-10 text-center text-2xl font-bold">No teams found</div>
	{:else}
		<Table.Root class="lg:text-md">
			<Table.Header>
				<Table.Row>
					<Table.Head>#</Table.Head>
					<Table.Head>Team name</Table.Head>
                    <Table.Head>Solves</Table.Head>
					<Table.Head>Hint Penalty</Table.Head>
					<Table.Head>Time Penalty</Table.Head>
					<Table.Head class="text-right">Final Score</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.teams as team (team.team_id)}
                    <Table.Row class="py-4 text-md {team.status == 'banned' ? 'bg-red-200 text-red-700 dark:bg-red-800 dark:text-red-100 rounded-md' : ''}
					
					">
                        <Table.Cell class="py-4 font-medium {team_id == team.team_id ? 'border-l-8 border-primary' : ''}">{team.rank}</Table.Cell>
						<Table.Cell class="py-4 font-medium"><a class="hover:underline hover:underline-offset-4 " href="/teams/{team.team_id}">{team.name}</a></Table.Cell>
                        <Table.Cell>{team.solve_count}</Table.Cell>
						<Table.Cell>{team.hint_penalty}</Table.Cell>
						<Table.Cell>{team.time_diff}</Table.Cell>
                        <Table.Cell class="text-right">{team.final_score}</Table.Cell>
                    </Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
