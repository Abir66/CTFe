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

	

</script>

<h1 class="py-5 text-lg font-semibold"><span class="font-bold">{data.username}</span>'s  solved problems</h1>



<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.problem_list.length == 0}
		<div class="py-10 text-center text-2xl font-bold">No Problems found</div>
	{:else}
		<Table.Root class="lg:text-lg">
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>ContestName</Table.Head>
					<Table.Head>Category</Table.Head>
					<Table.Head class="text-right">Submission Time</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.problem_list as problem (problem)}
					<Table.Row
						on:click={() => {
							goto(`/problems/${problem.id}`);
						}}
						class="hover:bg-slate-200 dark:hover:bg-slate-900"
					>
						<Table.Cell class="py-4 font-medium"
							>{problem.title}
							
						</Table.Cell>
						<Table.Cell>{problem.contest_name}</Table.Cell>
						<Table.Cell>{problem.category}</Table.Cell>
						<Table.Cell class="text-right">
                        {new Date(problem.created_at).toDateString()}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
