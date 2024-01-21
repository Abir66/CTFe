<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import { Button } from '$lib/components/ui/button';
	export let data;
    $: ({challenge } = data);
	
</script>

<div class="flex min-w-0 flex-col items-center p-5">
	<div class="text-center">
		<h1 class="text-2xl font-bold">{data.challenge.name}</h1>
		<h2 class="text-2xl">{data.challenge.score}</h2>
	</div>

	<div class="flex flex-col space-y-5">
		<div class="prose prose-lg dark:prose-invert py-5">
			<SvelteMarkdown source={challenge.description} />
		</div>

		{#if challenge.attachments && challenge.attachments.length > 0}
        <div>
			<h2 class="mb-3 text-xl">Attachments</h2>
			<div class="flex flex-wrap gap-3">
				{#each challenge.attachments as attachment (attachment)}
					<Button variant="outline" class="border-primary overflow-hidden truncate overflow-ellipsis whitespace-nowrap">
						<a href="{attachment.url}">{attachment.name}</a>
					</Button>
				{/each}
			</div>
        </div>
		{/if}

        <h2 class="mb-3 text-xl">Author : <a class="font-bold text-blue-700" href="/user/{challenge.author.id}">{challenge.author.username}</a></h2>

        <div class="text-center">
            <p class="text-xl ">{challenge.attempted}/{challenge.max_attempts} Attemps</p>
        </div>
	</div>
</div>
