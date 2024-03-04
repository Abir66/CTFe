<script>
    import MyMarkdown from "$lib/Markdown/MyMarkdown.svelte";
    import * as Card from "$lib/components/ui/card";
    import { Separator } from "$lib/components/ui/separator";
    import {ThickArrowUp, ThickArrowDown,Pencil2,Trash} from "radix-icons-svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Button } from '$lib/components/ui/button';
	import { goto } from "$app/navigation";
	import { Input } from "$lib/components/ui/input";
	import * as Popover from "$lib/components/ui/popover";
    import * as Avatar from "$lib/components/ui/avatar";
	import { comment } from "postcss";
    export let data;

    let Upload_time = change_date_format(data.blog.blog.blog_info.created_at);
    $: vote_type = data.blog.blog.vote_type;
    $: up_vote_count = data.blog.blog.blog_info.up;
    $: down_vote_count = data.blog.blog.blog_info.down;
    let delete_blog_open = false;
    $: delete_blog_error = null;
    $: comment_text = "";
    $: comments =  data.blog.blog.comments ? data.blog.blog.comments : [];
    let comment_delete_pop_open = false
    
    async function comment_delete(comment_id,index){
        comments.splice(index,1);
        comments = comments;
        const response = await fetch(`/api/blogs/deletecomment`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                blog_id: data.blog.blog.blog_info.blog_id,
                user_id: data.user_id,
                comment_id: comment_id
            })
        });
        console.log(await response.json())
    }
    function delete_blog_dialog() {
        delete_blog_open = true;
    }
    function edit_blog(){
        goto('/blogs/'+data.blog.blog.blog_info.blog_id+'/edit');
    }
    async function delete_blog(){
        const response =await fetch(`/api/blogs/deleteblog`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                blog_id: data.blog.blog.blog_info.blog_id
            })
        });
        goto('/blogs');
    }
    function change_date_format(date){
        let d = new Date(date);
        return d.toDateString() + " " + d.toLocaleTimeString();
    }
    async function add_comment(){
        if(comment_text == "")
            return;
        if(!comments)
            comments = [];
        comments.push({
            content: comment_text,
            user_id: data.user_id,
            blog_id: data.blog_id,
            created_at: new Date(),
            username: data.username,
            comment_id: 0
        })
        comments = comments
        const response = await fetch(`/api/blogs/addcomment`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                blog_id: data.blog.blog.blog_info.blog_id,
                content: comment_text
            })
        });
        const response_data = await response.json();
        const id = response_data.response.data[0].insert_comment;
        comments[comments.length-1].comment_id = id;
        comments = comments;


    }
    async function update_vote(type){
        
        if(vote_type == type){
            type = null;
            if(vote_type == "up")
                up_vote_count -= 1;
            else if(vote_type == "down")
                down_vote_count -= 1;
        }

        if(type == "up"){
            up_vote_count += 1;
            if(vote_type != null)
                down_vote_count -= 1;
        }
        else if(type == "down"){
            down_vote_count += 1;
            if(vote_type != null)
                up_vote_count -= 1;
        }
        vote_type = type;
        const response = await fetch(`/api/blogs/update_vote`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                blog_id: data.blog.blog.blog_info.blog_id,
                first: vote_type != null ? false : true
            })
        });
        
    }
</script>

<Dialog.Root bind:open={delete_blog_open} onOpenChange={(open) => {if (!open) {delete_blog_open = false;}}}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Delete Blog</Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
            Are You sure you want to delete this Blog? This action cannot be undone.
        </Dialog.Description>
           {#if delete_blog_error}
                <p class="text-red-500">{delete_blog_error}</p>
            {/if}
        <Dialog.Footer>
            <Button type="submit" variant="destructive" on:click={delete_blog} >Yes, Delete</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

<div class="flex flex-row justify-center">
    <Card.Root class=" md:w-3/4 align-center">
        <Card.Header>
        <Card.Title class="flex text-2xl border-black dark:border-white py-1">{data.blog.blog.blog_info.title}{#if data.blog.blog.user_info.user_id == data.user_id}<span on:click={edit_blog}><Pencil2 class="scale-120 mx-2 cursor-pointer"/></span><span on:click={delete_blog_dialog}><Trash class="scale-120 mx-2 cursor-pointer text-red-500"/></span>{/if } </Card.Title>
        <a class="text-slate-600 text-md dark:text-slate-400 hover:underline cursor-pointer" href="/user/{data.blog.blog.user_info.user_id}">{data.blog.blog.user_info.username}</a>
        <div class="text-slate-600 text-sm dark:text-slate-400">{Upload_time}</div>
        <Separator/>
        </Card.Header>
        <Card.Content class="text-sm">
        <div class="prose prose-lg dark:prose-invert">
            {#each data.blog.blog.blog_content as content}
                {#if content.type == "markdown"}
                    <MyMarkdown source={content.content} />
                {/if}
            {/each}
        </div> 
        </Card.Content>
        <Separator class=""/>
        <Card.Footer class="pt-5">
           <a on:click={()=>update_vote("up")}><ThickArrowUp class="scale-150 cursor-pointer mx-1 {vote_type == "up" ? "text-green-500":""}" /></a> <span class="mx-1 text-sm">{up_vote_count}</span><a on:click={()=>update_vote("down")}><ThickArrowDown class="h-30 scale-150 cursor-pointer ml-5 mr-1 {vote_type == "down" ? "text-red-500":""}" /></a><span class="mx-1 text-sm">{down_vote_count}</span>
        </Card.Footer>
    </Card.Root>
</div>
<div class="flex flex-row justify-center m-5">
    <Card.Root class="md:w-3/4 align-center my-3">
        <Card.Header>
        <Card.Title class="flex text-2xl border-black dark:border-white py-1">Comments</Card.Title>
        <Separator/>
        </Card.Header>
        <Card.Content class="">
        
        <div class="prose prose-2xl dark:prose-invert">
            {#if !comments}
            <div>No Comments Yet</div>
            {:else}
            {#each comments as comment,index}
            <Card.Root class="w-full md:w-full align-center mt-5">
                <Card.Header>
                    <div class="">
                        <a class="text-xl font-bold cursor-pointer hover:underline" href="/user/{comment.user_id}" >{comment.username}</a>
                        <span class="text-xs ml-1 text-slate-400 dark:text-slate-600">{new Date(comment.created_at).toISOString().replace('T', ' ').replace(/\.\d+/, '').substring(0, 19)}</span>
                        {#if comment.user_id == data.user_id}
                            <span class="float-right text-red-500 cursor-pointer scale-150 hover:text-red-800 dark:hover:text-red-300" on:click={comment_delete(comment.comment_id,index)}><Trash/></span>
                        {/if}
                    </div>
                </Card.Header>
                <Card.Content> 
                    
                    <Separator/>
                    <div class="text-lg">{comment.content}</div> 
                </Card.Content>
                <Separator class=""/>
            </Card.Root>       
            {/each}
            {/if}
        </div>   
        </Card.Content>
        <Separator class=""/>
        <Card.Footer class="pt-5 flex">
            <Input
				type="text"
				name="comment"
                placeholder="Write a comment"
				bind:value={comment_text}
			/>
            <Button type="button" class="ml-3" on:click={add_comment}>Comment</Button>
        </Card.Footer>
    </Card.Root>
</div>


<style>

    .icon-size {
        width: 30px;
        height: auto;
    }
</style>

<!-- <Card.Root class="w-1/2 md:w-3/4 sm:w-full align-center">
    <Card.Header>
    <Card.Title"></Card.Title>
    <Separator/>
    </Card.Header>
    <Card.Content>  
    </Card.Content>
    <Separator class=""/>
    <Card.Footer class="pt-5 flex">
    </Card.Footer>
</Card.Root> -->
