<script>
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { LockClosed } from 'radix-icons-svelte';
	import { StarFilled } from 'radix-icons-svelte';
	import Categories from '$lib/categories';

	import { goto } from '$app/navigation';
    import { page } from '$app/stores';

	export let data ;

</script>


<h1 class="py-5 text-4xl font-bold mr-8">Problems</h1> 

<form
  action="/problems"
  method="GET"
  class="w-full mb-10 flex flex-col items-center justify-between gap-y-5 py-4 text-xl md:flex-row lg:gap-x-5 lg:gap-y-0"
>
	<div class="w-full">
		<Input  name="search_str" class="w-full" placeholder={data.search_str? data.search_str : 'Search problem'} type="text" />
	</div>

	<div class="flex w-full justify-between gap-x-5">
		<Select.Root multiple={true}>
			<Select.Trigger class="w-full">
				<Select.Value placeholder="Type" />
			</Select.Trigger>
			<Select.Content>
				{#each Categories as category}
					<Select.Item value="{category}">{category}</Select.Item>
				{/each}
			</Select.Content>
			<Select.Input name="category" />
		</Select.Root>
	</div>

	<div class="flex justify-start w-full gap-x-5">
		<Button type="submit" class="w-full">Search</Button>
		{#if data.search_str || data.category }
        	<Button variant='outline' class="w-full" on:click={()=>{goto(`/problems`)}}>Clear</Button>
    	{/if}
	</div>
	
</form>

<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.problems.length == 0}
		<div class="py-10 text-center text-2xl font-bold">No contests found</div>
	{:else}
		<Table.Root class="lg:text-md">
			<Table.Header>
				<Table.Row>
					<Table.Head>Problem</Table.Head>
					<Table.Head>Contest</Table.Head>
					<Table.Head class="text-right">Category</Table.Head>
					<!-- <Table.Head class="text-right">Status</Table.Head> -->
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.problems as problem (problem)}
					<Table.Row class="hover:bg-slate-200 dark:hover:bg-slate-900" on:click={() => {goto(`/problems/${problem.id}`);}}	>
						<Table.Cell class="py-4 font-medium">{problem.title}</Table.Cell>
						<Table.Cell class="py-4 font-medium"><a href="/contests/{problem.contest_id}" class="hover:underline">{problem.contest_name}</a></Table.Cell>
						<Table.Cell class="py-4 font-medium text-right">{problem.category}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
