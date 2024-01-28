<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { page } from '$app/stores';

	//import { superForm } from 'sveltekit-superforms/client';
	//import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let form;
	export let data;

	//const { form, errors, constraints, enhance, formId } = superForm(data.form);
	let type = "Register"


	const open_create = () => {
		type = "Create_team";
	}
	const open_join = () => {
		type = "Join_team";
	}

</script>
<div class="p-5">
	<div class="text-center py-5">
		<h1 class="text-2xl font-bold">{type}</h1>
	</div>
	
		<div class="content-center flex flex-col lg:flex-row  px-10">
			<Button variant="outline" type="submit" class="w-full hover:invert border-primary" on:click={open_create}>Create a Team</Button>
			<Button variant="outline" type="submit" class="w-full hover:invert border-primary" on:click={open_join}>Join a Team</Button>
		</div>
	{#if type == "Create_team"}
		<form method="post" class="px-10" use:enhance>
				<div>
					<label for="team_name" class="block my-2 text-sm font-medium text-gray-900 dark:text-white">Team Name</label>
					<input type="text" id="team_name" name="team_name" class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
				</div>
			<button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create</button>
		</form>

	{/if}
</div>

