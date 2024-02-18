<script>
    import * as Card from "$lib/components/ui/card";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$lib/components/ui/dialog";
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Textarea } from "$lib/components/ui/textarea"
    import MyMarkdown from "$lib/Markdown/MyMarkdown.svelte";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs"
    import { Trash } from 'radix-icons-svelte'
    import { invalidateAll } from "$app/navigation";
    

    
    export let data;
    
    const total_announcements = data.announcements.length;
    let title = "";
    let description = "";
    let contest_id = data.contest_id;

    const deleteAnnouncement = async (a_id) =>{
        const response = await fetch(`/api/contests/${contest_id}/organizer/announcement/${a_id}`,{
            method: 'POST'
        });
        invalidateAll();
    }
</script>
<Dialog >
    <DialogTrigger class="ml-5 mt-5"><Button>+ Add Announcement</Button></DialogTrigger>
    <DialogContent class="h-3/4 overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="my-2">Add a anouncement</DialogTitle>
        <DialogDescription>
            <form method="POST" action="?/postAnnouncement" class=""  >
                <Tabs defaultValue="edit">
                    <TabsList class="w-full">
                    <TabsTrigger value="edit" class="w-1/2">Edit</TabsTrigger>
                    <TabsTrigger value="preview" class="w-1/2">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                        <Input name="title" class="w-full" type="text" placeholder="Title" bind:value={title}/>
                        <Textarea name="description" class="w-full h-96 resize-none overflow-y-auto mt-2" placeholder="Description" bind:value={description}/>
                    </TabsContent>
                    <TabsContent value="preview">
                        <div class="h-96 overflow-y-auto mt-10 border-1">
                            <Card.Root class="mx-2  border-0">
                                <Card.Header>
                                <Card.Title class="text-lg border-b-2 border-black dark:border-white py-1">{title}</Card.Title></Card.Header>
                                <Card.Content>
                                <div class="prose prose-md dark:prose-invert">
                                    <MyMarkdown source={description} />
                                </div>
                                </Card.Content>
                            </Card.Root>
                        </div>
                        
                    </TabsContent>
                </Tabs>
                <Button type="submit" class="mt-2 float-right">Post</Button>
            </form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
    {#if total_announcements > 0}
    {#each data.announcements as announcement}
        <Card.Root class="mx-2 my-4">
            <Card.Header>
                <Card.Title class="text-xl border-b-2 border-black dark:border-white py-1 flex justify-between">{announcement.title}
                    <Dialog>
                        <DialogTrigger><Trash class="text-red-500 hover:cursor-pointer" /></DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure you want to delete <span class="truncate">{announcement.title}</span>?</DialogTitle>
                            <DialogDescription>
                            <form  on:submit|preventDefault={()=>deleteAnnouncement(announcement.id)} method="POST" action="/api/contests/{contest_id}/organizer/announcements" class="flex w-full gap-x-5"  >
                              <Button type="submit" class="w-full my-2 bg-red-500 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-300">Confirm Delete </Button>
                            </form>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                </Card.Title>
            </Card.Header>
            <Card.Content>
            <div class="prose prose-md dark:prose-invert">
                <MyMarkdown source={announcement.description} />
            </div>
            </Card.Content>
        </Card.Root>
    {/each}
{:else}
        <h1 class="w-full font-bold text-2xl text-center">No announcement yet</h1>

{/if}


