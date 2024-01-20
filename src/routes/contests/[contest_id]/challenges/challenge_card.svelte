<script>
	export let challenge;
	import * as Card from '$lib/components/ui/card';
</script>


<Card.Root
	class="border-black border-4 bg-primary text-secondary h-25 flex w-full sm:w-1/3 md:w-1/4 lg:w-1/5 flex-col items-center space-y-2 p-3 align-middle {challenge.status == 'solved'? ' bg-green-500 text-black': ''}">
	<h3 class="max-w-full overflow-hidden truncate overflow-ellipsis whitespace-nowrap text-center text-lg font-semibold">
		{challenge.title}
    </h3>
	<h4 class="text-center text-lg font-semibold">{challenge.points}</h4>
</Card.Root>
