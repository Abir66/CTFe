<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	export let icon_path: string;
	export let title: string;
	export let icon_alt = '';
	export let url = '/';
</script>

<Card.Root
	class="hover:shadow-slate-500 hover:shadow-lg duration-250 aspect-square w-3/4 transition hover:scale-110 lg:hover:scale-125 hover:border-primary sm:w-1/2 lg:w-1/4"
>
	<a href={url} class="flex h-full w-full flex-col justify-center p-10 align-middle">
		<div class="items-middle m-auto flex aspect-square w-1/2 justify-center">
			<img class="dark:stroke-white dark:stroke-2 m-auto w-full" src={icon_path} alt={icon_alt} />
		</div>

		<h2 class="mt-3 scroll-m-20 text-center text-2xl font-extrabold">
			{title}
		</h2>
	</a>
</Card.Root>
