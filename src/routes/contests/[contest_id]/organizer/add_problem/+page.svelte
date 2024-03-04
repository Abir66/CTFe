<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import MyMarkdown from '$lib/Markdown/MyMarkdown.svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import categories from '$lib/categories.js';
	import { enhance } from '$app/forms';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { Trash } from 'radix-icons-svelte';
	// import problem from '$lib/server/database/problem';
	let description = 'hehe';
	export let form;
	export let data;

	let links = [];
	let l = '';
	let n = '';
	function addLink() {
		console.log(links);
		links.push({ link: l, name: n });
		links = links;
		console.log(links);

		l = '';
		n = '';
	}

	let hint = '';
	let penalty = '';
	let hints = [];
	function addHint() {
		hints.push({ hint: hint, penalty: penalty });
		hints = hints;
		hint = '';
		penalty = '';
	}

	function removeHint(hint) {
		const index = hints.indexOf(hint);
		hints.splice(index, 1);
		hints = hints;
	}

	let requirements = [];

	function addRequirement(problem) {
		console.log(problem);
		if (requirements.find((req) => req.id == problem.id)) {
			return;
		}
		requirements.push({ id: problem.id, title: problem.title, category: problem.category });
		requirements = requirements;
	}

	function removeRequirement(requirement) {
		console.log(requirement);
		const index = requirements.indexOf(requirement);
		requirements.splice(index, 1);
		requirements = requirements;
	}
</script>

<form
	method="post"
	class="pl-20 pt-20"
	action="?/ProblemCreation"
	enctype="multipart/form-data"
	use:enhance={({ formData }) => {
		// Remove the unnecessary code block
		formData.append('links', JSON.stringify(links));
		formData.append('hints', JSON.stringify(hints));
		formData.append('requirements', JSON.stringify(requirements));
	}}
>
	<div>
		{#if form?.HintAddFailed}
			<p class="invalid">Hint addition failed</p>
		{/if}

		{#if form?.problemcreationfailed}
			<p class="invalid">Problem creation failed</p>
		{/if}

		{#if form?.variationaddfailed}
			<p class="invalid">Variation addition failed</p>
		{/if}
		{#if form?.Fileuploadfailed}
			<p class="invalid">File upload failed</p>
		{/if}
		{#if form?.Addattachmentfaild}
			<p class="invalid">Failed attach files</p>
		{/if}
		{#if form?.RequirementAddFailed}
			<p class="invalid">Requirement addition failed</p>
		{/if}
		{#if form?.category}
			<p class="invalid">Invalid Category</p>
		{/if}
	</div>

	<div class="flex flex-col lg:flex-row lg:space-x-28">
		<div class="flex w-full flex-col space-y-6 lg:basis-2/3">
			<Label for="title">Title</Label>
			<Input type="text" name="title" placeholder="name of the problem">title</Input>
			<Label for="points">Points</Label>
			<Input type="text" name="points" placeholder="score of the problem">point</Input>
			<Label for="maxAttempt">Max attempt</Label>
			<Input
				type="text"
				name="maxAttempt"
				placeholder="maximum attempt user can take to solve this problem">Max attempt</Input
			>
			<Label for="category">Category</Label>
			<Select.Root>
				<Select.Trigger>
					<Select.Value placeholder="Select a category" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each categories as category}
							<Select.Item value={category}>{category}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="category" class="mb-28" />
			</Select.Root>

			<br />
			<Separator />
			<p class="p-6 text-center text-lg font-bold underline underline-offset-4">Variation 0</p>
			<Label for="name">Name</Label>
			<Input type="text" name="name" placeholder="name of the variation">name</Input>
			<Label for="description">Description</Label>
			<Tabs>
				<TabsList class="w-full">
					<TabsTrigger value="edit" class="w-1/2">Edit</TabsTrigger>
					<TabsTrigger value="preview" class="w-1/2">Preview</TabsTrigger>
				</TabsList>
				<TabsContent value="edit">
					<Textarea
						name="description"
						class="mt-2 h-48 w-full resize-none overflow-y-auto"
						placeholder="Description"
						bind:value={description}
					/>
				</TabsContent>
				<TabsContent value="preview">
					<div class="border-1 mt-10 h-48 overflow-y-auto">
						<Card.Root class="mx-2  border-0">
							<Card.Content>
								<div class="prose prose-md dark:prose-invert">
									<MyMarkdown source={description} />
								</div>
							</Card.Content>
						</Card.Root>
					</div>
				</TabsContent>
			</Tabs>
			<Label for="flag">Flags</Label>
			<Input type="text" name="flag" placeholder="flag">flag</Input>
			<p class="py-6 text-lg font-bold">Attachments</p>
			<Label for="files">Upload Files</Label>
			<Input type="file" name="files" placeholder="files" multiple>files</Input>
			<Label for="links">Add Links</Label>
			<Input type="hidden" name="links" placeholder="Any dive link you want to provide">link</Input>
			<div class="flex flex-row space-x-2 text-center">
				<Input
					type="text"
					name="link"
					placeholder="Any dive link you want to provide"
					bind:value={l}>link</Input
				>
				<Input type="text" name="linkname" placeholder="name of the link" bind:value={n}>name</Input
				>
				<Button class="hover:invert  " on:click={addLink}>+Add</Button>
			</div>
			<Button type="submit" class="hover:invert">Create</Button>
		</div>
		<div class="flex basis-full flex-col space-y-6 pl-4 lg:basis-1/3">
			<p class="font-bold">Hint</p>
			<div class="flex flex-row">
				<div class="mt-2 flex-wrap items-center px-1 py-1">
					{#each hints as hint, i}
						<HoverCard.Root>
							<HoverCard.Trigger rel="noreferrer noopener">
								<div
									class="m-0.5 inline-block rounded-lg border-2 border-black px-1 text-center text-gray-800"
								>
									Hint {i}
									<button class="float-right h-5 w-5 rounded-lg" on:click={() => removeHint(hint)}
										>x</button
									>
								</div>
							</HoverCard.Trigger>
							<HoverCard.Content class="w-80">
								<div class="flex justify-between space-x-4">
									<div class="space-y-1">
										<h4 class="text-sm font-semibold">Hint {i}</h4>
										<p class="text-sm">{hint.hint}</p>
										<h4 class="text-sm font-semibold">Penalty:</h4>
										{#if hint.penalty == '0' || hint.penalty == ''}
											<p class="text-sm">No penalty</p>
										{:else}
											<p class="text-sm">{hint.penalty}</p>
										{/if}
									</div>
								</div>
							</HoverCard.Content>
						</HoverCard.Root>
					{/each}
				</div>
			</div>
			<Label for="penalty">Penalty</Label>
			<Input type="text" name="penalty" placeholder="penlty to take the hint" bind:value={penalty}
				>penalty</Input
			>
			<Input type="hidden" name="hints">link</Input>
			<Label for="hint">Hint</Label>
			<Textarea
				name="hint"
				class="mt-2 h-20 w-full resize-none overflow-y-auto"
				placeholder="Hint for the problem"
				bind:value={hint}>hint</Textarea
			>
			<Button class="align-right hover:invert" on:click={addHint}>+Add</Button>

			<p class="pt-8 font-bold underline underline-offset-8">Requirements</p>

			<div class="flex flex-col space-y-4">
				{#if requirements.length !== 0}
					<div class="grid w-full grid-cols-5 font-bold underline">
						<div class="col-span-2">Title</div>
						<div class="col-span-2">Category</div>
						<div class="col-span-1"></div>
					</div>
				{/if}

				{#each requirements as requirement, i}
					<div class="grid w-full grid-cols-5">
						<div class="col-span-2">{requirement.title}</div>
						<div class="col-span-2">{requirement.category}</div>
						<div class=" ml-4 hover:text-slate-500" on:click={() => removeRequirement(requirement)}>
							<Trash />
						</div>
					</div>
				{/each}
			</div>

			<Select.Root>
				<Select.Trigger>
					<Select.Value placeholder="Select a requirement" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<div class="flex flex-col">
							{#each data.problems as problem, i}
								<Select.Item value={problem}>
									<div class="grid w-full grid-cols-2" on:click={() => addRequirement(problem)}>
										<div class="">{problem.title}</div>
										<div class="">({problem.category})</div>
									</div>
								</Select.Item>
							{/each}
						</div>
					</Select.Group>
				</Select.Content>
				<Select.Input name="requirements" class="mb-28" />
			</Select.Root>
		</div>
	</div>
</form>

<style>
	.invalid {
		color: red;
	}
</style>
