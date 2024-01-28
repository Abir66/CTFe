<script>
    export let data;
    const team_members = data.props.team_members;
    const team_id = data.props.team_id;
    const leader_id = data.props.leader_id;
    const member_limit = data.props.contest_member_limit;
</script>

<h1 class="text-2xl font-bold">My team</h1>
{#each team_members as member,index}
     <div class="flex"><div class="text-lg font-semibold cursor-pointer rounded-sm p-2">{index+1}.&nbsp;&nbsp;{member.username}</div> {#if member.user_id == leader_id} <div class=" align-middle font-semibold text-sm text-gray-300 dark:text-gray-500 cursor-pointer rounded-sm p-2">(leader)</div> {/if}</div>
{/each}
{#if team_members.length < member_limit}
    <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
    <p id="standard_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">{data.props.error_message}</p>
    <form method="post" class="">
        <label for="user_name" class="block my-2 text-lg font-bold text-gray-900 dark:text-white">+&nbsp;&nbsp;Add Member</label>
        <input type="text" id="user_name" name="user_name" class="mb-2 md:w-1/2 lg:w-1/2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
    </form>
{/if}


