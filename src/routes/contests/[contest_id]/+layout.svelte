<script lang="ts">
    import {page} from "$app/stores";
    import { Separator } from "$lib/components/ui/separator";
    let contest_name = "BUET CTF 2023";

    const contest_id = $page.params.contest_id;
    
    console.log($page);
    let x=($page.url.pathname).split("/");
    console.log(x[x.length-1]);
    
    let selected=x[x.length-1];
</script>

<h1 class="scroll-m-20 py-2 text-3xl font-extrabold">
    {contest_name}
</h1>

<Separator/>

<div class="flex justify-between py-5 text-sm sm:text-base lg:text-xl mb-10">
    <div class="space-x-3 sm:space-x-5">
        <a href="/contests/{contest_id}/challenges" class:active={selected==="challenges"} on:click={()=>{selected="challenges"}}  class="section">Challenges</a>
        <a href="/contests/{contest_id}/standings" class:active={selected==="standings"} on:click={()=>{selected="standings"}} class="section">Standings</a>
        <a href="/contests/{contest_id}/clarifications" class:active={selected==="clarifications"} on:click={()=>{selected="clarifications"}} class="section">Clarifications</a>
        <a href="/contests/{contest_id}/announcements" class:active={selected==="announcements"} on:click={()=>{selected="announcements"}} class="section">Announcements</a>
    </div>
    <a href="/contests/{contest_id}/my_team">My Team</a>
</div>

<slot />


<style>
    .active{
        color:#d91b42;
        border-bottom: 2px solid #d91b42;
        padding-bottom: 8px;
    }
    .section{
       
       font-size: 1rem;
       font-weight:bold;
    }
</style>
