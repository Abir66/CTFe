<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';

	import { superForm } from 'sveltekit-superforms/client';
	export let data;

	const {
		form : team_create_form,
		errors : team_create_errors,
		constraints : team_create_constraints,
		message : team_create_message,
		enhance : team_create_enhance,
		formId : team_create_formId
	} = superForm(data.team_create_form);

	const {
		form : team_join_form,
		errors : team_join_errors,
		constraints : team_join_constraints,
		message : team_join_message,
		enhance : team_join_enhance,
		formId : team_join_formId
	} = superForm(data.team_join_form);
	
</script>

<div class="mt-10 flex justify-center">
	<Tabs.Root value="Create Team" class="w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="Create Team">Create Team</Tabs.Trigger>
			<Tabs.Trigger value="Join Team">Join Team</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="Create Team">
			<Card.Root class="py-5 pb-10">
				<form method="post" action="?/create" class="grid gap-1.5 space-y-5 px-10" use:team_create_enhance>
					<div class="flex flex-col space-y-5">
						
						<div class="form-input">
							<Label for="team_name">Team Name</Label>
							<Input
								type="text"
								name="team_name"
								aria-invalid={$team_create_errors.team_name ? 'true' : undefined}
								bind:value={$team_create_form.team_name }
								{...$team_create_constraints.team_name }
							/>
							{#if $team_create_errors.team_name}<span class="invalid">{$team_create_errors.team_name}</span>{/if}
						</div>

						{#if data.contest_type == 'private'}
						<div>
							<div class="form-input">
								<Label for="contest_password">Contest Password</Label>
								<Input
									type="password"
									name="contest_password"
									aria-invalid={$team_create_errors.contest_password ? 'true' : undefined}
									bind:value={$team_create_form.contest_password }
									{...$team_create_constraints.contest_password }
								/>
								{#if $team_create_errors.contest_password}<span class="invalid">{$team_create_errors.contest_password}</span>{/if}
							</div>
						</div>
						{/if}
						{#if $team_create_message}
							<p class="error text-red-600">{$team_create_message}</p>
						{/if}
					</div>
					<Button type="submit">Create</Button>
				</form>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="Join Team">
			<Card.Root class="py-5 pb-10">
				<form method="post" action="?/join" class="grid gap-1.5 space-y-5 px-10" use:team_join_enhance>
					<div class="flex flex-col space-y-5">
						<div class="form-input">
							<Label for="team_name">Team Name</Label>
							<Input
								type="text"
								name="team_name"
								aria-invalid={$team_join_errors.team_name ? 'true' : undefined}
								bind:value={$team_join_form.team_name }
								{...$team_join_constraints.team_name }
							/>
							{#if $team_join_errors.team_name}<span class="invalid">{$team_join_errors.team_name}</span>{/if}
						</div>
						<div>
							<div class="form-input">
								<Label for="team_password">team Password</Label>
								<Input
									type="password"
									name="team_password"
									aria-invalid={$team_join_errors.team_password ? 'true' : undefined}
									bind:value={$team_join_form.team_password }
									{...$team_join_constraints.team_password }
								/>
								{#if $team_join_errors.team_password}<span class="invalid">{$team_join_errors.team_password}</span>{/if}
							</div>
						</div>
						{#if $team_join_message}
							<p class="error text-red-600">{$team_join_message}</p>
						{/if}
					</div>
					<Button type="submit">Join</Button>
				</form>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
