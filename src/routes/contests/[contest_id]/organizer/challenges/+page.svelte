<script>
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	export let data ;
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';



const go_to_add_problem = () => {
	goto('/contests/'+data.contest_id+'/organizer/add_problem');
};
</script>

<div class="flex justify-between w-full items-center">
	<h1 class="py-5 text-2xl font-bold mr-8">Problems</h1> 
	{#if $page.data.user}
	<Button  class="hover:scale-105" on:click={go_to_add_problem}>+ Add Problem</Button>
	{/if}
</div>





<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.problems.length == 0}
		<div class="py-10 text-center text-2xl font-bold">No problems found</div>
	{:else}
		<Table.Root class="lg:text-lg">
			<Table.Header>
				<Table.Row>
					<Table.Head>Title</Table.Head>
					<Table.Head>category</Table.Head>
					<Table.Head>score</Table.Head>
					<Table.Head class="text-right">Author</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.problems as problem ,i}
					<Table.Row
						on:click={() => {
							goto(`/contests/${data.contest_id}/organizer/challenges/${problem.id}`);
						}}
						class="hover:bg-slate-200 dark:hover:bg-slate-900"
					>
						<Table.Cell class="py-4 font-medium"
							>{problem.title}
							
						</Table.Cell>
						<Table.Cell>{problem.category}</Table.Cell>
						<Table.Cell>{problem.score}</Table.Cell>
						<Table.Cell class="text-right">
							{problem.author_name}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
