<script>
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	export let data ;
	import { LockClosed } from 'radix-icons-svelte';
	import { StarFilled } from 'radix-icons-svelte';
	import { goto } from '$app/navigation';

	const contest_types = [
		{ value: 'all', label: 'All' },
		{ value: 'public', label: 'Public' },
		{ value: 'private', label: 'private' },
		{ value: 'official', label: 'official' }
	];

	const contest_status = [
		{ value: 'all', label: 'All' },
		{ value: 'upcoming', label: 'Upcoming' },
		{ value: 'running', label: 'Running' },
		{ value: 'finished', label: 'Finished' }
	];



</script>

<h1 class="py-5 text-4xl font-bold">Contests</h1>

<form
  action="/contests"
  method="GET"
  class="mb-10 flex flex-col items-center justify-between gap-y-5 py-4 text-xl lg:flex-row lg:gap-x-5 lg:gap-y-0"
>
	<div class="w-full lg:w-1/2">
		<Input  name="search_str" class="w-full" placeholder="Search contest by name" type="text" />
	</div>

	<div class="flex w-full justify-between gap-x-5 lg:w-1/2">
		<Select.Root>
			<Select.Trigger class="w-full">
				<Select.Value placeholder="Type" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each contest_types as type}
						<Select.Item value={type.value} label={type.label}>{type.label}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="type" />
		</Select.Root>

		<Select.Root>
			<Select.Trigger class="w-full">
				<Select.Value placeholder="Status" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each contest_status as status}
						<Select.Item value={status.value} label={status.label}>{status.label}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="status" />
		</Select.Root>

		<Button type="submit">Search</Button>
	</div>
</form>

<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.contest_list.length == 0}
		<div class="py-10 text-center text-2xl font-bold">No contests found</div>
	{:else}
		<Table.Root class="lg:text-lg">
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Start</Table.Head>
					<Table.Head>Duration</Table.Head>
					<Table.Head class="text-right">Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.contest_list as contest (contest)}
					<Table.Row
						on:click={() => {
							goto(`/contests/${contest.id}`);
						}}
						class="hover:bg-slate-200 dark:hover:bg-slate-900"
					>
						<Table.Cell class="py-4 font-medium"
							>{contest.contest_name}
							{#if contest.type == 'private'}
								<LockClosed class="inline text-red-500" />
							{:else if contest.type == 'official'}
								<StarFilled class="inline text-yellow-500" />
							{/if}
						</Table.Cell>
						<Table.Cell>{new Date(contest.start_time).toDateString()}</Table.Cell>
						<Table.Cell>{contest.duration}</Table.Cell>
						<Table.Cell class="text-right">
							{#if contest.status == 'upcoming'}
								<Badge class="bg-blue-500">{contest.status}</Badge>
							{:else if contest.status == 'running'}
								<Badge class="bg-emerald-500">{contest.status}</Badge>
							{:else}
								<Badge class="bg-red-500">{contest.status}</Badge>
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
