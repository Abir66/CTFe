<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data;

	const { form, errors, constraints, enhance, formId } = superForm(data.form);
	
    $: ({challenge } = data);

	$: console.log(challenge);
	
	
	$: message = data.message;

</script>

{#if challenge}
<div class="flex min-w-0 flex-col items-center p-5">
	<div class="text-center">
		<h1 class="text-2xl font-bold">{challenge.challenge.title}</h1>
		<h2 class="text-2xl">{challenge.challenge.score}</h2>
	</div>

	<div class="flex flex-col space-y-5">
		<div class="prose prose-lg dark:prose-invert py-5">
			<SvelteMarkdown source={challenge.challenge.description} />
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

        <h2 class="mb-3 text-xl">Author : <a class="font-bold text-blue-700" href="/user/{challenge.challenge.author_id}">{challenge.challenge.author_name}</a></h2>
		

        <div class="text-center">
            <p class="text-xl ">{challenge.challenge.attempt_count}/{challenge.challenge.max_attempts} Attemps</p>
        </div>

		

		<form use:enhance method="POST" action="?/submitTilte" class="flex w-full gap-x-5"  >
			<input type="hidden" name="__superform_id"/>
			<div class="w-3/4">
				<Input class="border-primary"
					type="text"
					name="flag"
					placeholder="Flag"
					aria-invalid={$errors.flag ? 'true' : undefined}
					bind:value={$form.flag}
					{...$constraints.flag}
				/>
				{#if $errors.flag}<span class="invalid">{$errors.flag}</span>{/if}
			</div>

			<Button class="w-1/4" type="submit">Submit</Button>
		</form>
		{#if message == 'correct' && message.length > 0}
        	<p id="filled_success_help" class="p-3 text-center rounded mt-2 text-md bg-green-500 dark:bg-green-600"><span class=" font-semibold">{message}</span></p>		
		{:else if message.length > 0}
			<p id="standard_error_help" class="p-3 text-center rounded mt-2 text-md bg-red-600 dark:bg-red-700"><span class=" font-semibold">{message}</span></p>
		{/if}

	</div>
</div>
{/if}