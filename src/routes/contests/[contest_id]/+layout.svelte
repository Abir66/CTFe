<script lang="ts">
    import {page} from "$app/stores";
    import { Separator } from "$lib/components/ui/separator";
    let contest_name = "BUET CTF 2023";

    const contest_id = $page.params.contest_id;
    
    let x=($page.url.pathname).split("/");
    
    let selected='';
    if($page.url.pathname.includes('challenges')){
        selected='challenges';
    }
    else if($page.url.pathname.includes('standings')){
        selected='standings';
    }
    else if($page.url.pathname.includes('clarifications')){
        selected='clarifications';
    }
    else if($page.url.pathname.includes('announcements')){
        selected='announcements';
    }
</script>

<h1 class="scroll-m-20 mt-5 py-2 text-3xl font-extrabold">
    {contest_name}
</h1>

<Separator/>

<div class="flex justify-between py-5 text-sm sm:text-base lg:text-xl mb-10">
    <div class="space-x-3 sm:space-x-5">
        <a href="/contests/{contest_id}/challenges" class:active={selected==="challenges"} on:click={()=>{selected="challenges"}}>Challenges</a>
        <a href="/contests/{contest_id}/standings" class:active={selected==="standings"} on:click={()=>{selected="standings"}} >Standings</a>
        <a href="/contests/{contest_id}/clarifications" class:active={selected==="clarifications"} on:click={()=>{selected="clarifications"}}>Clarifications</a>
        <a href="/contests/{contest_id}/announcements" class:active={selected==="announcements"} on:click={()=>{selected="announcements"}}>Announcements</a>
    </div>
    <a href="/contests/{contest_id}/my_team">My Team</a>
</div>

<slot />


<style>
    .active{
        border-bottom: 2px solid black;
        padding-bottom: 8px;
    }
</style>
