<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import SvelteMarkdown from 'svelte-markdown';
    import * as Table from "$lib/components/ui/table";
    export let data;
    import { goto } from '$app/navigation';
    let total_announcements = data.announcements.length;
</script>
{#if total_announcements > 0}
    {#each data.announcements as announcement}
        <Card.Root class="my-4">
            <Card.Header>
            <Card.Title class="text-xl border-b-2 border-black dark:border-white py-2">{announcement.title}</Card.Title></Card.Header>
            <Card.Content>
            <div class="prose prose-lg dark:prose-invert py-5">
                <SvelteMarkdown source={announcement.description} />
            </div>
            </Card.Content>
        </Card.Root>
    {/each}
{:else}
        <h1 class="w-full font-bold text-2xl text-center">No announcement yet</h1>

{/if}