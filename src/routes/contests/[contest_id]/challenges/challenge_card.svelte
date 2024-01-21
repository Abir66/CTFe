<script lang="ts">
	export let challenge;
	import * as Card from '$lib/components/ui/card';
	import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';

	import * as Dialog from '$lib/components/ui/dialog';
	import ChallengeModal from './[challenge_id]/+page.svelte';
	let ChallengeDialogueOpen = false;

	async function showModal(e: MouseEvent & { currentTarget: HTMLAnchorElement }) {
		if (e.metaKey || e.ctrlKey) return;
		e.preventDefault();

		const { href } = e.currentTarget;

		const result = await preloadData(href);

		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, { modalData: result.data });
			// ChallengeDialogueOpen = true;
		} else {
			goto(href);
		}
	}

	$: if ($page.state.modalData) {
		ChallengeDialogueOpen = true;
	} else {
		ChallengeDialogueOpen = false;
	}
</script>

{#if ChallengeDialogueOpen}
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
			<ChallengeModal data={$page.state.modalData} />
		</Dialog.Content>
	</Dialog.Root>
{/if}

<Card.Root
	class="h-25 flex w-full flex-col items-center space-y-2 border-4  hover:scale-105 border-black bg-primary p-3 align-middle text-secondary sm:w-1/3 md:w-1/4 lg:w-1/5 {challenge.status ==
	'solved'
		? ' bg-green-500 text-black'
		: ''}"
>
	<a
		on:click|preventDefault={showModal}
		href="/contests/{1}/challenges/{challenge.id}"
		class="h-full w-full"
	>
		<h3
			class="max-w-full overflow-hidden truncate overflow-ellipsis whitespace-nowrap text-center text-lg font-semibold"
		>
			{challenge.title}
		</h3>
		<h4 class="text-center text-lg font-semibold">{challenge.points}</h4>
	</a>
</Card.Root>
