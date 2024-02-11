
<script lang="ts">
	import { cn } from "$lib/utils";
    import { page } from "$app/stores";
	let className: string | undefined | null = undefined;
	export { className as class };
    export let data;
        
    let selected='profile';
    if($page.url.pathname.includes('blogs')){
        
        selected='blogs';
    }
    else if($page.url.pathname.includes('contests')){
        selected='contests';
    }
    else if($page.url.pathname.includes('problems')){
        selected='problems';
    }
    else if($page.url.pathname.includes('edit_profile')){
        selected='edit_profile';
    }
    
    
</script>


<div class="border-b">
    <div class="flex h-16 items-center px-4">
        <nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            <a href="/user/{data.id}" 
            class="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            class:text-primary={selected==="profile"} on:click={()=>{selected="profile"}}
            >
                Profile
            </a>
        
            <a
                href="/user/{data.id}/blogs"
                class="text-sm font-medium  transition-colors hover:text-primary text-muted-foreground"
                class:text-primary={selected==="blogs"} on:click={()=>{selected="blogs"}}
            >
                Blogs
            </a>
            <a
                href="/user/{data.id}/contests/participation"
                class="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                class:text-primary={selected==="contests"} on:click={()=>{selected="contests"}}
            >
                Contests
            </a>
            <a
                href="/user/{data.id}/problems"
                class="text-sm font-medium transition-colors hover:text-primary  text-muted-foreground "
                class:text-primary={selected==="problems"} on:click={()=>{selected="problems"}}
            >
                Problems
            </a>
        </nav>
        {#if $page.data.user && $page.data.user.id == data.id}
        <div class="ml-auto flex items-center space-x-4">
            <a
                href="/user/edit_profile"
                class="text-sm font-medium  transition-colors hover:text-primary text-muted-foreground " 
               class:text-primary={selected==="edit_profile"} on:click={()=>{selected="edit_profile"}}
            >
                Edit
            </a>
        </div>
        {/if}
     
    </div>
</div>

<slot />