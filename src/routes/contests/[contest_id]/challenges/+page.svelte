<script lang="ts">
	import ChallengeCard from './challenge_card.svelte';
	export let data;
	console.log(data);
</script>

{#each data.challenge_list as section (section)}
<div class="mb-20">
	<h2 class="scroll-m-20 py-2 text-3xl font-bold mb-10">
		{section.catagory}
	</h2>

	<div class="flex flex-col sm:flex-row flex-wrap gap-x-20 gap-y-10">
		{#each section.challenges as challenge (challenge)}
			<ChallengeCard challenge={challenge} />
		{/each}
	</div>
</div>
{/each}
