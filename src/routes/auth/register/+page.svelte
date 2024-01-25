<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	export let data;
	const { form, errors, constraints, enhance } = superForm(data.form)

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="mx-auto flex w-full flex-col justify-center space-y-6 py-10 sm:w-[350px]">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="mb-5 text-3xl font-semibold tracking-tight">Create an account</h1>
	</div>

	<form method="POST" use:enhance class="flex flex-col gap-y-5">
		<div class="form-input">
			<Label for="email">Username</Label>
			<Input
				type="text"
				name="username"
				aria-invalid={$errors.username ? 'true' : undefined}
				bind:value={$form.username}
				{...$constraints.username}
			/>
			{#if $errors.username}<span class="invalid">{$errors.username}</span>{/if}
		</div>

		<div class="form-input">
			<Label for="email">E-mail</Label>
			<Input
				type="email"
				name="email"
				aria-invalid={$errors.email ? 'true' : undefined}
				bind:value={$form.email}
				{...$constraints.email}
			/>
			{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
		</div>

		<div class="form-input">
			<Label for="password">Password</Label>
			<Input
				type="password"
				name="password"
				aria-invalid={$errors.password ? 'true' : undefined}
				bind:value={$form.password}
				{...$constraints.password}
			/>
			{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
		</div>
		<Button type="submit">Register</Button>
	</form>

	<p class="px-8 text-center text-sm text-muted-foreground">
		Already have an account?{' '}
		<a href="/auth/login" class="font-bold underline underline-offset-4 hover:text-primary">
			Sign in Instead.
		</a>
	</p>
</div>

<style>
	.invalid {
		color: red;
	}

	.form-input {
		display: grid;
		width: 100%;
		max-width: 24rem;
		align-items: center;
		gap: 0.375rem;
	}
</style>
