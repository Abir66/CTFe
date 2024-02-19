<script>
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from "$lib/components/ui/label";
	export let data ;
	import { goto } from '$app/navigation';
	import * as Popover from "$lib/components/ui/popover";
	import * as Select from "$lib/components/ui/select";

	function formatSubmissionTime(inputTime) {
		const date = new Date(inputTime);
		const month = date.toLocaleString('default', { month: 'short' });
		const day = date.getDate();
		const year = date.getFullYear();
		const hour = date.getHours();
		const minute = date.getMinutes();
		const second = date.getSeconds();
		return `${month} ${day} ${year} ${hour}:${minute}:${second}`;
	}

	// import category from '$lib/categories';
	import Categories from '$lib/categories';

</script>

<form action="/contests/{data.contest_id}/organizer/submissions" method="GET" class="mb-5 flex flex-col items-center py-4 text-xl gap-y-5">
	
	<div class="flex flex-col md:flex-row w-full justify-between md:space-x-5 space-y-5 md:space-y-0">
		<div class="w-full">
			<Label for="search_team_name" class="mb-2">Search Team</Label>
			<Input name="search_team_name" class="w-full" placeholder="Search for a team" type="text" />
		</div>
		<div class="w-full">
			<Label for="search_username" class="mb-2">Search user</Label>
			<Input name="search_username" class="w-full" placeholder="Search by username" type="text" />
		</div>
		<div class="w-full">
			<Label for="search_problem_name" class="mb-2">Search problem</Label>
			<Input name="search_problem_name" class="w-full" placeholder="Search by problem" type="text" />
		</div>
	</div>

	<div class="flex flex-col md:flex-row w-full justify-between md:space-x-5 space-y-5 md:space-y-0 align-middle">
		<div class="w-full md:w-1/2">
			<Select.Root>
				<Select.Trigger class="w-full">
				  <Select.Value placeholder="Category" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="any">Any</Select.Item>
					{#each Categories as category}
						<Select.Item value="{category}">{category}</Select.Item>
					{/each}
				</Select.Content>
				<Select.Input name="category" />
			  </Select.Root>
		</div>
		<div class="w-full">
			<Button type="submit">Search</Button>
			{#if data.has_params}
				<Button variant='outline' on:click={()=>{goto(`/contests/${data.contest_id}/organizer/submissions`)}}>Clear</Button>
			{/if}
		</div>
	</div>
</form>

<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.submissions.length == 0}
		<div class="py-10 text-center text-2xl font-bold">No submission found</div>
	{:else}
		<Table.Root class="lg:text-md">
			<Table.Header>
				<Table.Row>
					<Table.Head>Team name</Table.Head>
					<Table.Head>username</Table.Head>
					<Table.Head>Problem</Table.Head>
					<Table.Head>Catagory</Table.Head>
					<Table.Head>Verdict</Table.Head>
					<Table.Head>Submitted at</Table.Head>
                    <!-- <Table.Head>Solves</Table.Head>
					<Table.Head class="text-right">Score</Table.Head> -->
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.submissions as submission (submission.id)}
                    <Table.Row class="py-4">
                        <Table.Cell class="py-4 font-medium">{submission.team_name}</Table.Cell>
						<Table.Cell class="py-4 font-medium">{submission.username}</Table.Cell>
                        <Table.Cell>{submission.title}</Table.Cell>
						<Table.Cell>{submission.category}</Table.Cell>
						<Table.Cell>{submission.verdict}</Table.Cell>
						<Table.Cell>{formatSubmissionTime(submission.time)}</Table.Cell>
						<Popover.Root>
							<Popover.Trigger class="py-4">
							  ...
							</Popover.Trigger>
							<Popover.Content class="w-80">
								<div class="flex flex-col gap-y-5">
									<div>
										<div class="text-sm font-bold">Submitted Flag</div>
										<div>{submission.flag}</div>
									</div>

									<div>
										<div class="text-sm font-bold">Verdict</div>
										<div>{submission.verdict}</div>
									</div>

									<div>
										<div class="text-sm font-bold">Variation</div>
										<div>{submission.variation_name}</div>
									</div>

								</div>
							</Popover.Content>
						  </Popover.Root>
                    </Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
