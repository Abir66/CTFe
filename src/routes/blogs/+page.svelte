<script>
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	export let data ;
	import {ThickArrowUp, ThickArrowDown,Pencil2,Trash} from "radix-icons-svelte";
	import * as Select from '$lib/components/ui/select';
	
	
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let time_search = ["ASC","DESC","none"];
	let vote_search = ["ASC","DESC","none"]

	onMount(()=>{
		console.log("on mount");
		let query = new URLSearchParams($page.url.searchParams.toString());
		query.set('search_str', "");
		console.log(query);
    })
	
	const go_to_create_blog = () => {
		goto('/blogs/createblog');
	};

</script>

<div class="flex justify-between w-full items-center">
	<h1 class="py-5 text-4xl font-bold mr-8">Blogs</h1> 
	{#if $page.data.user}
	<Button  class="hover:scale-105" on:click={go_to_create_blog}>+ Create Blog</Button>
	{/if}
</div>




<form
  action="/blogs"
  method="GET"
  class="mb-10 flex flex-col items-center justify-between gap-y-5 py-4 text-xl lg:flex-row lg:gap-x-5 lg:gap-y-0"
>
	<div class="w-full lg:w-1/2">
		<Input  name="search_str" class="w-full" placeholder="Search contest by name" type="text" />
	</div>
	<Select.Root>
		<Select.Trigger class="w-1/4">
			<Select.Value placeholder="Sort by time" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each time_search as type}
					<Select.Item value={type} label={type}>{type}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="time" />
	</Select.Root>
	<Select.Root>
		<Select.Trigger class="w-1/4">
			<Select.Value placeholder="Sort by vote" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each vote_search as type}
					<Select.Item value={type} label={type}>{type}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="vote" />
	</Select.Root>

	<div class="flex w-full justify-between gap-x-5 lg:w-1/2">

		<Button type="submit">Search</Button>
	</div>
</form>

<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.blogs.length == 0}
		<div class="py-10 text-center text-2xl font-bold">No Blogs found</div>
	{:else}
		<Table.Root class="lg:text-lg">
			<Table.Header>
				<Table.Row>
					<Table.Head>Title</Table.Head>
					<Table.Head>Author</Table.Head>
					<Table.Head>Time</Table.Head>
					<Table.Head class="text-right"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.blogs as blog (blog)}
					<Table.Row class="hover:bg-slate-200 dark:hover:bg-slate-900">
					<Table.Cell class="hover:underline cursor-pointer sm:truncate ... md:text-ellipsis" on:click={() => {
																			goto(`/blogs/${blog.id}`);
																		}}>{blog.title}</Table.Cell>
						<Table.Cell class="py-4 font-medium hover:underline cursor-pointer" on:click={() => {
							goto(`/user/${blog.user_id}`);
						}}
							>{blog.username}
						</Table.Cell>
						<Table.Cell>{new Date(blog.created_at).toDateString()}</Table.Cell>
						<Table.Cell class="text-right flex pt-5">
							<ThickArrowUp class="scale-150 mx-1 text-green-500" /><span class="mx-1 text-sm">{blog.up_votes}</span><ThickArrowDown class="h-30 scale-150 ml-5 mr-1 text-red-500" /><span class="mx-1 text-sm">{blog.down_votes}</span>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
