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
	

</script>

<form action="/contests/{data.contest_id}/teams" method="GET" class="mb-5 flex items-center py-4 text-xl  gap-x-5">
	<div class="w-full lg:w-1/2">
		<Input name="search_team_name" class="w-full" placeholder="Search team by name" type="text" />
	</div>
    <Button type="submit">Search</Button>
    {#if data.search_team_name!=''}
        <Button variant='outline' on:click={()=>{goto(`/contests/${data.contest_id}/teams`)}}>Clear</Button>
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

                    </Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>

