<script>
    import Text from '$lib/Markdown/MarkdownText.svelte';
    import SvelteMarkdown from 'svelte-markdown';
    export let source;
</script>

<SvelteMarkdown {source} renderers={{ html: Text }}/>

