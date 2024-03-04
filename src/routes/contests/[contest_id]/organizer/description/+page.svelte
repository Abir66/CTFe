<script>
    import { enhance, applyAction } from '$app/forms';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Textarea } from "$lib/components/ui/textarea"
    import MyMarkdown from "$lib/Markdown/MyMarkdown.svelte";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs"
    import * as Card from "$lib/components/ui/card";

    export let data;
    let description = data.description;
</script>

<h1 class="text-2xl">Edit Description</h1>
<div class="h-full overflow-y-auto mt-10 border-1">
    <form method="POST" action="?/saveDescription" class=""  >
        <Tabs>
            <TabsList class="w-full">
            <TabsTrigger value="edit" class="w-1/2">Edit</TabsTrigger>
            <TabsTrigger value="preview" class="w-1/2">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
                <Textarea name="description" class="w-full h-96 resize-none overflow-y-auto mt-2" placeholder="Description" bind:value={description}/>
            </TabsContent>
            <TabsContent value="preview">
                <div class="h-96 overflow-y-auto mt-10 border-1">
                    <Card.Root class="mx-2  border-0">
                        <Card.Content>
                        <div class="prose prose-md dark:prose-invert">
                            <MyMarkdown source={description ? description : ''} />
                        </div>
                        </Card.Content>
                    </Card.Root>
                </div>
                
            </TabsContent>
        </Tabs>
        <Button type="submit" class="mt-2 float-right">Save Edit</Button>
    </form>
</div>