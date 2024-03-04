<script lang="ts">
	export let data;
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	
	import Challenge from './challenge.svelte'
	let dialogueOpen = false;
	let selected_challenge_id = 0;

	async function showModal(challenge_id) {
		dialogueOpen = true;
		selected_challenge_id = challenge_id;
		
	}


</script>

{#if dialogueOpen}
	<Dialog.Root open
		onOpenChange={(open) => {
			if (!open) {
				dialogueOpen = false;
			}
		}}
	>
		<Dialog.Content>
			<Challenge challenge_id={selected_challenge_id}/>
		</Dialog.Content>
	</Dialog.Root>
{/if}

{#if data.contest_paused}
	<div class="flex justify-center items-center h-96">
		<h1 class="text-3xl font-bold">Contest Paused</h1>
	</div>

{:else if data.challenge_list.length == 0}
	<div class="flex justify-center items-center h-96">
		<h1 class="text-3xl font-bold">No challenges available</h1>
	</div>
{/if}

{#each data.challenge_list as section (section)}
	<div class="mb-20">
		<h2 class="mb-10 scroll-m-20 py-2 text-3xl font-bold">
			{section.category}
		</h2>

		<div class="flex flex-col flex-wrap gap-x-20 gap-y-10 sm:flex-row">
			{#each section.challenges as challenge (challenge)}
				<Card.Root on:click={() => showModal(challenge.id)}
					class="h-25 flex w-full flex-col items-center space-y-2 border-4  border-black bg-primary p-3 align-middle text-secondary hover:scale-105 sm:w-1/3 md:w-1/4 lg:w-1/5 {challenge.status ==
					'solved'
						? ' bg-green-500 text-black'
						: ''}"
				>
					<h3
						class="max-w-full overflow-hidden truncate overflow-ellipsis whitespace-nowrap text-center text-lg font-semibold"
					>
						{challenge.title}
					</h3>
					<h4 class="text-center text-lg font-semibold">{challenge.score}</h4>
				</Card.Root>
			{/each}
		</div>
	</div>
{/each}

