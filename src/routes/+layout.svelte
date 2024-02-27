<script lang="ts">
	import Navbar from './navbar.svelte';
	import { page } from '$app/stores';
	import { Toaster } from "$lib/components/ui/sonner";
	export let data;
</script>


<!-- {#if !$page.url.pathname.startsWith('/auth')} -->
	<Navbar user={data.user} />
<!-- {/if} -->
<Toaster />
<div class="container mx-auto px-[5%] py-4">
	<slot />
</div>
