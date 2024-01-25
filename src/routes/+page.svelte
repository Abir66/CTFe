<script lang="ts">
	import SectionCard from './section_card.svelte';

	import puzzle from '$lib/assets/homepage/puzzle.svg';
	import flag from '$lib/assets/homepage/flag.svg';
	import book from '$lib/assets/homepage/book.svg';

</script>

<div class="mt-10 flex flex-col space-y-24">
	<h1 class="w-full scroll-m-20 text-center text-4xl font-extrabold tracking-tight">
		WELCOME TO CTFe
	</h1>

	<div class="flex flex-col items-center justify-between space-y-16 lg:flex-row lg:space-y-0">
		<SectionCard
			title="SOLVE PROBLEMS"
			icon_path={puzzle}
			url="/problems"
		/>
		<SectionCard
			title="PARTICIPATE IN CONTESTS"
			icon_path={flag}
			url="/contests"
		/>
		<SectionCard
			title="READ & WRITE BLOGS"
			icon_path={book}
			url="/blogs"
		/>
	</div>
</div>
