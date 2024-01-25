<script lang="ts">
	export let data;
	import * as Card from '$lib/components/ui/card';
	import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Dialog from '$lib/components/ui/dialog';
	import ChallengeModal from './[challenge_id]/+page.svelte';
	let ChallengeDialogueOpen = false;
	
	let modalDst = '';

	async function showModal(challenge_id) {
		console.log(challenge_id);
		const href = `/contests/1/challenges/1`;
		modalDst = href;

		const result = await preloadData(href);

		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, { 
				data : result.data,
				path : href
			});
			// ChallengeDialogueOpen = true;
		} else {
			goto(href);
		}
	}

	$: if ($page.state.data) {
		ChallengeDialogueOpen = true;
	} else {
		ChallengeDialogueOpen = false;
	}
</script>

{#if ChallengeDialogueOpen && $page.state.path && $page.state.path.includes('challenge') }
	<Dialog.Root
		open={ChallengeDialogueOpen}
		onOpenChange={(open) => {
			if (!open) {
				history.back();
				ChallengeDialogueOpen = false;
			}
		}}
	>
		<Dialog.Content>
			<ChallengeModal data={$page.state.data} />
		</Dialog.Content>
	</Dialog.Root>
{/if}

{#each data.challenge_list as section (section)}
	<div class="mb-20">
		<h2 class="mb-10 scroll-m-20 py-2 text-3xl font-bold">
			{section.catagory}
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
					<h4 class="text-center text-lg font-semibold">{challenge.points}</h4>
				</Card.Root>
			{/each}
		</div>
	</div>
{/each}
