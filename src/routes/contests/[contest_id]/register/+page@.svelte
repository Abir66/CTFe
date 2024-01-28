<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';

	export let form;
</script>

<div class="mt-10 flex justify-center">
	<Tabs.Root value="Create Team" class="w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="Create Team">Create Team</Tabs.Trigger>
			<Tabs.Trigger value="Join Team">Join Team</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="Create Team">
			<Card.Root class="py-5 pb-10">
				<form method="post" action="?/create" class="grid gap-1.5 space-y-5 px-10" use:enhance>
					<div class="div">
						<Label for="team_name">Team name</Label>
						<Input type="text" name="team_name" class="w-full" />
						{#if form?.create_team_error}
							<p class="error text-red-600">{form.create_team_error}</p>
						{/if}
					</div>
					<Button type="submit">Create</Button>
				</form>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="Join Team">
			<Card.Root class="py-5 pb-10">
				<form method="post" action="?/join" class="grid gap-1.5 space-y-10 px-10" use:enhance>
					<div class="flex flex-col space-y-5">
						<div>
							<Label for="team_name">Team Name</Label>
							<Input type="text" name="team_name" class="max-w-xs" />
						</div>
						<div>
							<Label for="password">Password</Label>
							<Input type="password" name="password" class="max-w-xs" />
						</div>
						{#if form?.join_team_error}
							<p class="error text-red-600">{form.join_team_error}</p>
						{/if}
					</div>
					<Button type="submit">Join</Button>
				</form>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
