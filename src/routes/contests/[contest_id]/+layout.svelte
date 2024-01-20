<script lang="ts">
    import {page} from "$app/stores";
    import { Separator } from "$lib/components/ui/separator";
    let contest_name = "BUET CTF 2023";

    const contest_id = $page.params.contest_id;

</script>

<h1 class="scroll-m-20 py-2 text-3xl font-extrabold">
    {contest_name}
</h1>

<Separator/>

<div class="flex justify-between py-5 text-sm sm:text-base lg:text-xl mb-10">
    <div class="space-x-3 sm:space-x-5">
        <a href="/contests/{contest_id}/challenges">Challenges</a>
        <a href="/contests/{contest_id}/standings">Standings</a>
        <a href="/contests/{contest_id}/clarifications">Clarifications</a>
        <a href="/contests/{contest_id}/announcements">Announcements</a>
    </div>
    <a href="/contests/{contest_id}/my_team">My Team</a>
</div>

<slot />