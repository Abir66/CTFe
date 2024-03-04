<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { Download, Trash} from 'radix-icons-svelte';
	import categories from '$lib/categories';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
	import MyMarkdown from '$lib/Markdown/MyMarkdown.svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { enhance } from '$app/forms';
	import { getValue } from '@unovis/ts';
	export let data;

	let links = [];
	let l = '';
	let n = '';
							
	let fileinput : HTMLInputElement;
	// function addLink() {
	// 	console.log(links);
	// 	links.push({ link: l, name: n });
	// 	links = links;
	// 	console.log(links);

	// 	l = '';
	// 	n = '';
	// }

	let description = '';

	let hint = '';
	let penalty = '';
	let flags = [];
	for (let i = 0; i < data.variations.length; i++) {
		flags[i] = '';
	}
	async function addHintToDatabase() {
		console.log(data.hints.length);
		const formData = new FormData();
		formData.append('score', penalty);
		formData.append('description', hint);
		console.log(hint);
		console.log(penalty);
		const response = await fetch(
			`/api/contests/${data.contest_id}/organizer/problems/${data.problem.id}/AddHint`,
			{
				method: 'POST',
				body: formData
			}
		);

		const result = await response.json();
		console.log(result);
		if (result.success) {
			data.hints.push({
				description: hint,
				penalty_score: penalty,
				id: result.data[0].id,
				problem_id: data.problem.id
			});
			data.hints = data.hints;
			hint = '';
			penalty = '';
		}
	}
	
async function addFile(variationIndex) {


	    const formData = new FormData();
		formData.append('id', data.variations[variationIndex].id);
		for(let i=0;i<fileinput.files.length;i++){
			formData.append('files', fileinput.files[i]);
		}
		const response = await fetch(
			`/api/contests/${data.contest_id}/organizer/problems/${data.problem.id}/AddAttachment`,
			{
				method: 'POST',
				body: formData
			}
		);
		// for(let i=0;i<fileinput.files.length;i++){
		// 	formData.append('files', fileinput.files[i]);
		// }
		// formData.append('id', data.variations[i].id);
		// const response = await fetch(
		// 	`/api/contests/${data.contest_id}/organizer/problems/${data.problem.id}/AddFlag`,
		// 	{
		// 		method: 'POST',
		// 		body: formData
		// 	}
		// );
		const result = await response.json();
		if (result.success) {
			console.log(result.data[0]);
			data.variations[variationIndex].attachment.push(result.data[0]);
			data.variations = data.variations;
		}
		console.log(fileinput.files);
		
	
}
	async function removeHintFromdatabase(hint) {
		const index = data.hints.indexOf(hint);
		data.hints.splice(index, 1);
		data.hints = data.hints;
		console.log(data.hints.length);

		const formData = new FormData();
		formData.append('id', hint.id);
		const response = await fetch(
			`/api/contests/${data.contest_id}/organizer/problems/${hint.problem_id}/DeleteHint`,
			{
				method: 'POST',
				body: formData
			}
		);

		const result = await response.json();
		console.log(result);
	}

	async function Edit_problem(event) {
		const formEl = event.target as HTMLFormElement;
		const formdata = new FormData(formEl);
		if (formdata.get('category') == '') {
			formdata.set('category', data.problem.category);
		}
		console.log(formdata.get('category'));
		const response = await fetch(
			`/api/contests/${data.contest_id}/organizer/problems/${data.problem.id}/EditProblem`,
			{
				method: 'POST',
				body: formdata
			}
		);

		const result = await response.json();
		if (result.success) {
			data.problem.title = result.data[0].title;
			data.problem.score = result.data[0].score;
			data.problem.max_attempts = result.data[0].max_attempts;
			data.problem.category = result.data[0].category;

			data.problem = data.problem;
		}

		console.log(result);
	}

	async function addRequirementToDatabase(problem) {
		console.log(problem);
		if (data.requirements.find((req) => req.id == problem.id)) {
			return;
		}

		const formData = new FormData();
		formData.append('id', problem.id);
		formData.append('dependent_id', data.problem.id);
		const response = await fetch(
			`/api/contests/${data.contest_id}/organizer/problems/${data.problem.id}/AddRequirement`,
			{
				method: 'POST',
				body: formData
			}
		);
		const result = await response.json();
		if (result.success) {
			data.requirements.push(problem);
			data.requirements = data.requirements;
		}
	}

	async function addFlag(i) {
		console.log(flags[i]);
		if (data.variations[i].flags.find((flag) => flag == flags[i])) {
			console.log('flag already exists');

			return;
		}

		const formData = new FormData();
		formData.append('flagsofVariation', flags[i]);
		formData.append('id', data.variations[i].id);
		const response = await fetch(
			`/api/contests/${data.contest_id}/organizer/problems/${data.problem.id}/AddFlag`,
			{
				method: 'POST',
				body: formData
			}
		);
		const result = await response.json();
		if (result.success) {
			console.log(result.data[0].flags);
			data.variations[i].flags = result.data[0].flags;
			data.variations = data.variations;
			flags[i] = '';
		}
	}
	//removeFlag
	async function removeFlag(flagIndex, variationIndex) {
		var flag = data.variations[variationIndex].flags[flagIndex];
		data.variations[variationIndex].flags.splice(flagIndex, 1);
		const formData = new FormData();
		formData.append('flagsofVariation', flag);
		formData.append('id', data.variations[variationIndex].id);
		const response = await fetch(
			`/api/contests/${data.contest_id}/organizer/problems/${data.problem.id}/RemoveFlag`,
			{
				method: 'POST',
				body: formData
			}
		);
		const result = await response.json();
		if (result.success) {
			console.log(result.data[0].flags);
			data.variations[variationIndex].flags = result.data[0].flags;
			data.variations = data.variations;
		}
	}

	async function removeAttachment(attachmentIndex, variationIndex) {
		
		const formData = new FormData();
		formData.append('id', data.variations[variationIndex].attachment[attachmentIndex].id);
		
		const response = await fetch(
			`/api/contests/${data.contest_id}/organizer/problems/${data.problem.id}/removeAttachment`,
			{
				method: 'POST',
				body: formData
			}
		);
		const result = await response.json();
		if (result.success) {
			data.variations[variationIndex].attachment.splice(attachmentIndex, 1);
			data.variations = data.variations;
		}
	}

	async function removeRequirementFromDatabase(requirement) {
		console.log(requirement);

		const formData = new FormData();
		formData.append('id', requirement.id);
		formData.append('dependent_id', data.problem.id);
		const response = await fetch(
			`/api/contests/${data.contest_id}/organizer/problems/${data.problem.id}/RemoveRequirement`,
			{
				method: 'POST',
				body: formData
			}
		);
		const result = await response.json();
		if (result.success) {
			const index = data.requirements.indexOf(requirement);
			data.requirements.splice(index, 1);
			data.requirements = data.requirements;
		}
	}
	async function Edit_variation(event) {
		const formEl = event.target as HTMLFormElement;
		const formdata = new FormData(formEl);

		console.log(data.problem.id);

		const response = await fetch(
			`/api/contests/${data.contest_id}/organizer/problems/${data.problem.id}/EditVariation`,
			{
				method: 'POST',
				body: formdata
			}
		);
		const result = await response.json();
		if (result.success) {
			console.log('hehe hoise');
			data.variations.forEach((variation) => {
				if (variation.id == result.data[0].id) {
					variation.variation_name = result.data[0].variation_name;
					variation.description = result.data[0].description;
				}
			});
		}

		console.log(result);
		console.log('haha');
	}
</script>

<form method="post" on:submit|preventDefault={Edit_problem} class="pl-16 pt-20">
	<div class="flex flex-col lg:flex-row lg:space-x-28">
		<div class="flex w-full flex-col space-y-6 lg:basis-2/3">
			<Label for="title">Title</Label>
			<Input
				type="text"
				name="title"
				placeholder="name of the problem"
				bind:value={data.problem.title}>title</Input
			>
			<Label for="points">Points</Label>
			<Input
				type="text"
				name="points"
				placeholder="score of the problem"
				bind:value={data.problem.score}>point</Input
			>

			<Label for="maxAttempt">Max attempt</Label>
			<Input
				type="text"
				name="maxAttempt"
				placeholder="maximum attempt user can take to solve this problem"
				bind:value={data.problem.max_attempts}>Max attempt</Input
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
			<Button class="align-right hover:invert" type="submit">Edit</Button>
		</div>
		<div class="flex basis-full flex-col space-y-6 pl-4 lg:basis-1/3">
			<p class="font-bold">Hint</p>
			<div class="flex flex-row">
				<div class="mt-2 flex-wrap items-center px-1 py-1">
					{#each data.hints as hint, i}
						<HoverCard.Root>
							<HoverCard.Trigger rel="noreferrer noopener">
								<div
									class="m-0.5 inline-block rounded-lg border-2 border-black px-1 text-center text-gray-800 dark:border-gray-800 dark:text-white"
								>
									Hint {i}
									<button
										class="float-right h-5 w-5 rounded-lg text-red-500"
										on:click={() => {
											removeHintFromdatabase(hint);
										}}>x</button
									>
								</div>
							</HoverCard.Trigger>
							<HoverCard.Content class="w-80">
								<div class="flex justify-between space-x-4">
									<div class="space-y-1">
										<h4 class="text-sm font-semibold">Hint {i}</h4>
										<p class="text-sm">{hint.description}</p>
										<h4 class="text-sm font-semibold">Penalty:</h4>
										{#if hint.penalty_score == '0' || hint.penalty_score == ''}
											<p class="text-sm">No penalty</p>
										{:else}
											<p class="text-sm">{hint.penalty_score}</p>
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
			<Button class="align-right hover:invert" on:click={addHintToDatabase}>+Add</Button>

			<p class="pt-8 font-bold underline underline-offset-8">Requirements</p>

			<div class="flex flex-col space-y-4">
				{#if data.requirements.length !== 0}
					<div class="grid w-full grid-cols-5 font-bold underline">
						<div class="col-span-2">Title</div>
						<div class="col-span-2">Category</div>
						<div class="col-span-1"></div>
					</div>
				{/if}

				{#each data.requirements as requirement, i}
					<div class="grid w-full grid-cols-5">
						<div class="col-span-2">{requirement.title}</div>
						<div class="col-span-2">{requirement.category}</div>
						<div
							class=" ml-4 hover:text-slate-500"
							on:click={() => removeRequirementFromDatabase(requirement)}
						>
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
									<div
										class="grid w-full grid-cols-2"
										on:click={() => addRequirementToDatabase(problem)}
									>
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
<br />
<Separator />
<p class="p-6 text-center text-lg font-bold underline underline-offset-4">Variations</p>

<Accordion type="single" collapsible className="w-full">
	{#each data.variations as variation, i}
		<AccordionItem value="item-{i}">
			<AccordionTrigger class="pl-10 pt-10">{variation.variation_name}</AccordionTrigger>
			<AccordionContent>
				<form mathod="POST" on:submit|preventDefault={Edit_variation} class="pl-20 pt-20">
					<div class="flex flex-col lg:flex-row lg:space-x-28">
						<div class="flex w-full flex-col space-y-6">
							<Input type="hidden" name="id" bind:value={variation.id}>link</Input>
							<Label for="name">Name</Label>
							<Input
								type="text"
								name="name"
								placeholder="name of the variation"
								bind:value={variation.variation_name}>name</Input
							>
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
										bind:value={variation.description}
									/>
								</TabsContent>
								<TabsContent value="preview">
									<div class="border-1 mt-10 h-48 overflow-y-auto">
										<Card.Root class="mx-2  border-0">
											<Card.Content>
												<div class="prose prose-md dark:prose-invert">
													<MyMarkdown source={variation.description} />
												</div>
											</Card.Content>
										</Card.Root>
									</div>
								</TabsContent>
							</Tabs>
							<Button type="submit" class="hover:invert">Edit</Button>
							<Label for="flag" class="pt-10">Flags</Label>
							{#each variation.flags as flag, j}
								<div class="grid w-full grid-cols-4 px-5">
									<div class="col-span-3 font-bold">{flag}</div>
									<div
										class=" "
										on:click={() => {
											removeFlag(j, i);
										}}
									>
										<Trash class=" h-5 w-5 text-red-600  hover:text-slate-500" />
									</div>
								</div>
							{/each}
							<div class="grid w-full grid-cols-4">
								<div class="col-span-3">
									<Input type="text" name="flag" placeholder="flag" bind:value={flags[i]}
										>flag</Input
									>
								</div>
								<div class=" ml-4 hover:text-slate-500">
									<Button class="hover:invert" on:click={() => addFlag(i)}>+Add</Button>
								</div>
							</div>
                               
							<p class="py-6 text-lg font-bold">Attachments</p>
							{#each variation.attachment as a, j}
							{#if a.id !== null}
								<div class="grid w-full grid-cols-4 px-5">
									<div class="col-span-3"><a href="{a.link}" class="text-blue-600 font-bold"><Download class="inline-block mx-4 h-5 w-5 text-blue-600 font-bold"/>{a.file_name}</a></div>
									<div
										class="  hover:text-slate-500 "
										on:click={()=>removeAttachment(j,i)}
									>
										<Trash class=" h-5 w-5 text-red-600  hover:text-slate-500"/>
									</div>
								</div>
							{/if}
							{/each}
							<Label for="files">Upload Files</Label>
							<div class="grid w-full grid-cols-4 align-center">
								<div class="col-span-3">
									
							<input type="file" name="files" placeholder="files" multiple bind:this={fileinput} >
								</div>
								<div class=" ml-4 hover:text-slate-500">
									<Button class="hover:invert" on:click={() => addFile(i)}>+Add File</Button>
								</div>
							</div>
							
							
						</div>
					</div>
				</form>
			</AccordionContent>
		</AccordionItem>
	{/each}
	<AccordionItem value="item-{data.variations.length}">
		<AccordionTrigger class="pl-10 pt-10">Add new variation</AccordionTrigger>
		<AccordionContent>
			<form method="post" action="?/addvariation" enctype="multipart/form-data" class="pl-20 pt-20">
				<div class="flex flex-col lg:flex-row lg:space-x-28">
					<div class="flex w-full flex-col space-y-6">
						<Input type="hidden" name="id">link</Input>
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
						<Label for="flag" class="pt-10">Flag</Label>
						<Input type="text" name="flag" placeholder="flag">flag</Input>
						<p class="py-6 text-lg font-bold">Attachments</p>
						<Label for="files">Upload Files</Label>
						<Input type="file" name="files" placeholder="files" multiple>files</Input>
						<Button type="submit" class="hover:invert">+Add</Button>
					</div>
				</div>
			</form>
		</AccordionContent>
	</AccordionItem>
</Accordion>

<br />
