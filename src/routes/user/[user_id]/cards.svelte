<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    export let type: string;
    export let count:string;
    export let user_id:string;
    export let path:string;
    import { goto } from '$app/navigation';
  
</script>

<Card.Root class="hover:scale-105 hover:shadow-slate-400 hover:shadow-md" on:click={() => {
    goto(`${user_id}/${path}/`);
}}>
    <Card.Header
        class="flex flex-row  justify-center space-y-0 pb-2"
    >
        <Card.Title class="text-2xl font-bold ">{count}</Card.Title>
        <!-- <Users class="h-4 w-4 text-muted-foreground" /> -->
    </Card.Header>
    <Card.Content class="text-center">
        <div class="text-md font-medium">{type}</div>
    </Card.Content>
</Card.Root>