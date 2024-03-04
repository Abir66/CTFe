<script>
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
    import {ThickArrowUp, ThickArrowDown,Pencil2,Trash} from "radix-icons-svelte";
	export let data ;

	import { LockClosed } from 'radix-icons-svelte';
	import { StarFilled } from 'radix-icons-svelte';
	import { goto } from '$app/navigation';

	// const contest_types = [
	// 	{ value: 'all', label: 'All' },
	// 	{ value: 'public', label: 'Public' },
	// 	{ value: 'private', label: 'private' },
	// 	{ value: 'official', label: 'official' }
	// ];

	// const contest_status = [
	// 	{ value: 'all', label: 'All' },
	// 	{ value: 'upcoming', label: 'Upcoming' },
	// 	{ value: 'running', label: 'Running' },
	// 	{ value: 'finished', label: 'Finished' }
	// ];


const ifNull = (value) => {
	if (value == null) {
		return 0;
	} else {
		return value;
	}
};

</script>
 
<h1 class="py-5 text-lg font-semibold"> Created Blogs</h1>


<div class="mb-10 rounded-md border px-10 py-5">
	{#if data.blogs_list.length == 0}
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
				{#each data.blogs_list as blog (blog)}
					<Table.Row class="hover:bg-slate-200 dark:hover:bg-slate-900">
					<Table.Cell class="hover:underline cursor-pointer sm:truncate ... md:text-ellipsis" on:click={() => {
																			goto(`/blogs/${blog.id}`);
																		}}>{blog.title}</Table.Cell>
						<Table.Cell class="py-4 font-medium hover:underline cursor-pointer" on:click={() => {
							goto(`/user/${data.user_id}`);
						}}
							>{data.username}
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