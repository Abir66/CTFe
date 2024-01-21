<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';

	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { toggleMode } from 'mode-watcher';

	let showMenu = false;

	function toggleNavbar() {
		showMenu = !showMenu;
	}
</script>

<div>
	<div class="border-b-2 border-zinc-300 dark:border-zinc-800">
		<nav class="container mx-auto px-[5%] py-4 md:flex md:items-center md:justify-between">
			<div class="flex items-center justify-between">
				<a class="text-xl font-bold md:text-3xl" href="/">CTFe</a>
				<!-- Mobile menu button -->
				<Button on:click={toggleNavbar} class="flex md:hidden">M</Button>
			</div>

			<!-- Mobile Menu open: "block", Menu closed: "hidden" -->
			<div
				class="mt-8 w-full flex-col justify-between space-y-4 md:mt-0 md:flex md:flex-row md:items-center md:space-x-10 md:space-y-0
		  {showMenu ? 'flex' : 'hidden'}"
			>
				<div class="flex flex-col space-y-5 md:ml-10 md:flex-row md:space-x-5  md:space-y-0 }">
					<a href={`/contests`}>Contests</a>
					<a href="/blog">Problems</a>
					<a href="/about">Blogs</a>
				</div>

				<div class="space-y-2 space-x-2">
					<Button on:click={toggleMode} variant="outline" size="icon">
						<Sun class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
						<Moon class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
						<span class="sr-only">Toggle theme</span>
					  </Button>
					<Button variant="outline" class="w-full  md:w-auto border-primary ">Login</Button>
					<Button class="w-full  md:w-auto ">Register</Button>
				</div>
			</div>
		</nav>
	</div>
</div>

<ModeWatcher />


