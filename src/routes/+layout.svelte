<script lang="ts">
	import Navbar from './navbar.svelte';
	import { page } from '$app/stores';
	export let data;
</script>


<!-- {#if !$page.url.pathname.startsWith('/auth')} -->
	<Navbar user={data.user} />
<!-- {/if} -->

<div class="container mx-auto px-[5%] py-4">
	<slot />
</div>
