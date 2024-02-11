<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';

	export let user = null;

	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { toggleMode } from 'mode-watcher';
	import { HamburgerMenu } from 'radix-icons-svelte';

	let showMenu = false;

	function toggleNavbar() {
		showMenu = !showMenu;
	}

	
	import Login from './auth/login/+page.svelte';
	import Register from './auth/register/+page.svelte';
	import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Avatar from "$lib/components/ui/avatar";
	
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	let modalOpen = false;
	let modalDest = '/auth/login';

	async function showModal(e: MouseEvent & { currentTarget: HTMLAnchorElement }) {
		if (e.metaKey || e.ctrlKey) return;
		e.preventDefault();

		const { href } = e.currentTarget;
		if(href.endsWith('/auth/login')) modalDest = '/auth/login';
		else if(href.endsWith('/auth/register')) modalDest = '/auth/register';
		
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

	$: if ($page.state.data && user == null) {
		modalOpen = true;
	} else {
		modalOpen = false;
	}
</script>


{#if modalOpen && user == null}
	<Dialog.Root
		open={modalOpen}
		onOpenChange={(open) => {
			if (!open) {
				history.back();
				modalOpen = false;
			}
		}}
	>
		<Dialog.Content>
			{#if modalDest === '/auth/login'}
				<Login data={$page.state.data} />
			{:else if modalDest === '/auth/register'}
				<Register data={$page.state.data} />
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{/if}




<div>
	<div class="border-b-2 border-zinc-300 dark:border-zinc-800">
		<nav class="container mx-auto px-[5%] py-4 md:flex md:items-center md:justify-between">
			<div class="flex items-center justify-between">
				<a class="text-xl font-bold md:text-3xl" href="/">CTFe</a>
				<!-- Mobile menu button -->
				<Button variant="ghost" on:click={toggleNavbar} class="flex md:hidden"><HamburgerMenu/></Button>
			</div>

			<!-- Mobile Menu open: "block", Menu closed: "hidden" -->
			<div class="mt-8 w-full flex-col justify-between space-y-4 md:mt-0 md:flex md:flex-row md:items-center md:space-x-10 md:space-y-0
		  {showMenu ? 'flex' : 'hidden'}"
			>
				<div class="flex flex-col space-y-5 md:ml-10 md:flex-row md:space-x-5  md:space-y-0 }">
					<a href={`/contests`}>Contests</a>
					<a href="/problems">Problems</a>
					<a href="/blogs">Blogs</a>
				</div>

				<div class="flex flex-col md:flex-row space-y-5 md:space-x-5 md:space-y-0">
					<Button on:click={toggleMode} variant="outline" size="icon" class="px-5">
						<Sun class="absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
						<Moon class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
						<span class="sr-only">Toggle theme</span>
					</Button>
					
					
					{#if user}
					     <div on:click={() => {
							goto(`/user/${user['id']}`);
						}}>
							<Avatar.Root class="border-primary border-2 hover:invert">
								<!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
								<Avatar.Fallback>{user['username'][0]}</Avatar.Fallback>
							</Avatar.Root>
						 </div>
						
						<form action="/auth/logout" method="POST" class="h-full w-full">
							<Button variant="outline" type="submit" class="w-full hover:invert md:w-auto border-primary">Logout</Button>
						</form>
						
					{:else}
						<a on:click|preventDefault={showModal} href="/auth/login"class="h-full w-full">
							<Button variant="outline" class="w-full hover:invert md:w-auto border-primary">Login</Button>
						</a>
						<a on:click|preventDefault={showModal} href="/auth/register"class="hover:invert h-full w-full">
							<Button class="w-full  md:w-auto ">Register</Button>
						</a>
					{/if}
					
				</div>
			</div>
		</nav>
	</div>
</div>

<ModeWatcher />


