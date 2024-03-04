<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
    import { writable } from "svelte/store";
	import { onMount } from 'svelte';
    import { Trash } from 'radix-icons-svelte'
	import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs"
    import * as Card from "$lib/components/ui/card";
    import MyMarkdown from "$lib/Markdown/MyMarkdown.svelte";
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
    import {PlusCircled,Image} from "radix-icons-svelte"
    import { goto, preloadData, pushState } from '$app/navigation';
	import { Title } from 'chart.js';
    export let data;
    console.log(data)
    let title = data.blog_info.title;
    let title_error = false;
    $: contents = data.blog_content;
    function add_markdown(){
        contents.push({
            id: contents.length+1,
            type: 'markdown',
            content: ''
        })
        contents = contents
    }
    function add_markdown_at(index){
        contents.splice(index+1,0,{
            id: contents.length+1,
            type: 'markdown',
            content: ''
        })
        contents = contents
    }
    onMount(()=>{
        title_error = false;
    })

    function update_local(){
        localStorage.setItem('myData', JSON.stringify(contents));
    }

    function delete_content(index){
        contents.splice(index,1);
        contents = contents;
    }

    async function edit_blog(){
        if(title == ""){
            title_error = true;
            return
        }
        const response = await fetch(`/api/blogs/editblog`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                blog_id: data.blog_info.blog_id,
                title: title,
                contents: contents
            })
        });
        localStorage.removeItem('myData');
        goto('/blogs/'+data.blog_info.blog_id);
        
        
    }

	
</script>

<div class="flex justify-center">
    <Card.Root class="w-1/2 md:w-3/4 sm:w-full align-center">
        <Card.Header>
        <Card.Title class="text-2xl border-black dark:border-white py-1">Edit Blog</Card.Title></Card.Header>
        <Card.Content>
            <Tabs defaultValue="edit">
                <TabsList class="w-full ">
                <TabsTrigger value="edit" class="w-1/2">Edit</TabsTrigger>
                <TabsTrigger value="preview" class="w-1/2">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                    <div class="">
                        <div class="flex basis-full flex-col space-y-6 lg:basis-1/2">
                            <Label for="title">Title</Label>
                            <Input type="text" name="title" placeholder="Blog title" required bind:value={title}>title</Input>
                            {#if title_error}
                                <p class="text-red-500">Enter a title</p>
                            {/if}
                            <Label for="description">Description</Label>
                            <div class="flex">
                                <span on:click = {()=>add_markdown_at(-1)}><PlusCircled class="scale-100 mr-3 hover:scale-150 cursor-pointer" /></span><Image class="scale-100 mr-3 hover:scale-150 cursor-pointer"/>
                            </div>
                            {#each contents as content,index}
                                <div class="flex">
                                    <span class="text-red-500 m-1 text-5xl cursor-pointer hover:text-6xl hover:mr-2" on:click={()=>delete_content(index)}>-</span>
                                    <Textarea name="description_{index+1}" on:change = {update_local} class="w-full h-10 resize-none overflow-y-auto mt-2"  bind:value={contents[index].content}/>
                                </div>
                            <div class="flex">
                                <span on:click = {()=>add_markdown_at(index)}><PlusCircled class="scale-100 mr-3 hover:scale-150 cursor-pointer" /></span><Image class="scale-100 mr-3 hover:scale-150 cursor-pointer"/>
                            </div>
                            
                                
                            {/each}
                            
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="preview">
                    <div class="h-96 overflow-y-auto mt-10 border-1">
                        <div class="prose prose-md dark:prose-invert">
                            {#each contents as content}
                                <MyMarkdown source={content.content} />
                            {/each}
                        </div>
                    </div>
                    
                </TabsContent>
            </Tabs>
        </Card.Content>
        <CardFooter>
            <Button type="submit" class="mt-2 float-right" on:click={edit_blog}>Save</Button>
        </CardFooter>
    </Card.Root>
    
</div>

<div class="flex flex-row justify-center w-full">
    
    
</div>

<form method="post">

</form>

<style>
	.invalid {
		color: red;
	}
</style>
