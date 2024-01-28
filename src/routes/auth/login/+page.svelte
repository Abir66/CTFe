<script lang="ts">
	//import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data; // : PageData

	const { form, errors, constraints, message, enhance, formId } = superForm(data.form);
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	import { goto, afterNavigate, invalidate, invalidateAll } from '$app/navigation';
	import { base } from '$app/paths'

	let previousPage : string = base ;

	afterNavigate(({from}) => {
		previousPage =  previousPage
	})

	$: if ($message == 'success') {
		goto(previousPage, {
			invalidateAll : true
		})
	}


</script>



<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] py-10">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-3xl font-semibold tracking-tight mb-5">Sign in</h1>
	</div>
	<!-- <UserAuthForm /> -->

	<form use:enhance method="POST" class="flex flex-col gap-y-5">
		<input type="hidden" name="__superform_id" bind:value={$formId} />
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
        <Button type="submit">Sign in</Button>
	</form>

    <p class="px-8 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <a href="/auth/register" class="font-bold underline underline-offset-4 hover:text-primary">
            Create one here.
        </a>
    </p>
</div>

<style>
	.invalid {
		color: red;
	}

    .form-input{
        display: grid;
        width: 100%;
        max-width: 24rem;
        align-items: center;
        gap: 0.375rem;
    }
</style>
