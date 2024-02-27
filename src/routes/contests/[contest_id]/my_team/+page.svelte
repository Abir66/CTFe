<script lang="ts">
    import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import * as Dialog from "$lib/components/ui/dialog";
    import { Separator } from "$lib/components/ui/separator";
    import { Switch } from "$lib/components/ui/switch";
    import { toast } from "svelte-sonner";
    export let data;
   
    let team_members = data.team_members;
    let invited_members = data.invited_members;
    const team_id = data.team_id;
    const team_info = data.team_info;
    const leader_id = team_info.leader_id;
   
    
    let delete_team_dialog_open = false;
    function show_delete_team_dialog() {
        delete_team_dialog_open = true;
    }


    let pass_error = '';
    async function set_password(event){
        pass_error = ''
        const formEl = event.target as HTMLFormElement
        const formData = new FormData(formEl)

        const password = formData.get('password') as string
        const confirm_password = formData.get('confirm_password') as string

        if(password != confirm_password){
            pass_error = 'Passwords do not match'   
            return
        }

        // Minimum length check
        if (password.length < 8) {
            console.log(password)
            console.log(password.length)
            pass_error = 'Password must be at least 8 characters long'
            return;
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);

        // Combine conditions using logical AND (all conditions must be met)
        if (!hasUppercase || !hasLowercase || !hasDigit) {
            pass_error = 'Password must contain at least one uppercase letter, one lowercase letter, and one digit';
            return;
        }
        
        const response = await fetch(`/api/team/${team_id}/set_password`, {
            method: 'POST',
            body: formData
        })
        const responseData = await response.json()

        if(responseData.success) toast("Password Saved Successfully")
        
        else{
            if(responseData.message) pass_error = responseData.message        
            else toast('Something went wrong. Please try again.')
        }

        formEl.reset()
    }


    let join_via_password_checked = team_info.allow_join_via_password;
    let join_via_password_error_message = '';
    async function toggle_allow_join_via_password(event){
        join_via_password_error_message = '';
        const checked = !join_via_password_checked
        const response = await fetch(`/api/team/${team_id}/allow_join_via_password`, {
            method: 'POST',
            body: JSON.stringify({checked})
        })
        const responseData = await response.json()
        if(responseData.success) toast(responseData.message)
        else {
            join_via_password_checked = !join_via_password_checked
            if(responseData.message) join_via_password_error_message = responseData.message        
            else toast("Something went wrong. Please try again.")
        }
    }


    let delete_team_error = '';
    async function delete_team(){
        delete_team_error = '';
        const response = await fetch(`/api/team/${team_id}/delete_team`, {
            method: 'POST'
        })
        const responseData = await response.json()
        if(responseData.success) {
            toast('Team Deleted Successfully')
            window.location.href = '/contests'
        }
        else {
            if(responseData.message) delete_team_error = responseData.message        
            else toast("Something went wrong. Please try again.")
        }
    }

    let team_member_error = '';
    async function remove_team_member(user_id){
        team_member_error = '';
        const response = await fetch(`/api/team/${team_id}/remove_member`, {
            method: 'POST',
            body: JSON.stringify({member_id:user_id})
        })
        const responseData = await response.json()
        console.log(responseData)
        if(responseData.success) {
            toast('Member Removed Successfully')
            team_members = team_members.filter(member => member.user_id != user_id)
        }
        else {
            if(responseData.message) team_member_error = responseData.message        
            else toast("Something went wrong. Please try again.")
        }
    }


    async function remove_invited_member(user_id){
        team_member_error = '';
        const response = await fetch(`/api/team/${team_id}/remove_invite`, {
            method: 'POST',
            body: JSON.stringify({member_id:user_id})
        })
        const responseData = await response.json()
        console.log(responseData)
        if(responseData.success) {
            toast('Member Removed Successfully')
            invited_members = invited_members.filter(member => member.invitee_id != user_id)
        }
        else {
            if(responseData.message) team_member_error = responseData.message        
            else toast("Something went wrong. Please try again.")
        }
    }

</script>



<Dialog.Root bind:open={delete_team_dialog_open} onOpenChange={(open) => {if (!open) {delete_team_dialog_open = false;}}}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Delete Team</Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
            Are You sure you want to delete this team? This action cannot be undone.
        </Dialog.Description>
           {#if delete_team_error}
                <p class="text-red-500">{delete_team_error}</p>
            {/if}
        <Dialog.Footer>
            <Button type="submit" variant="destructive" on:click={delete_team} >Yes, Delete</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>


<div class="flex flex-col w-full items-center">

<div class="flex">
    <h1 class="text-3xl font-bold mb-5">{team_info.name}</h1>
</div>



<div class="w-full md:w-1/2 py-10">
    <h2 class="text-xl mb-5 font-semibold underline underline-offset-8"> Team members</h2>

    {#each team_members as member,index (member)}
        <div class="flex py-2 justify-between">
            <div class="flex font-semibold text-lg gap-x-2 align-baseline">
                {index+1}.&nbsp;&nbsp;
                <a class="hover:underline" href="/users/1">{member.username}</a>
                {#if member.user_id == leader_id} 
                    <div class="text-sm text-gray-500 dark:text-gray-500">(leader)</div> 
                {/if}
            </div>
            {#if member.user_id != leader_id} 
                <Button class="text-sm" variant="outline" on:click={()=>{remove_team_member(member.user_id)}}>Remove</Button>
            {/if}
        </div>
        
        <Separator />
    {/each}

    {#each invited_members as member,index (member)}
        <div class="flex py-2 justify-between">
            <div class="flex font-semibold text-lg gap-x-2 align-baseline">
                {team_members.length + index+1}.&nbsp;&nbsp;
                <a class="hover:underline" href="/users/1">{member.username}</a>
                <div class="text-sm text-gray-500 dark:text-gray-500">(pending)</div> 
            </div>
           
            <Button class="text-sm" variant="outline" on:click={()=>{remove_invited_member(member.invitee_id)}}>Remove</Button>
        </div>
        
        <Separator />
    {/each}



    {#if team_member_error}
        <p class="text-red-500">{team_member_error}</p>
    {/if}
    
    <Button type="submit" class="w-full mt-5"> + Invite user</Button>
   

</div>


<div class="w-full md:w-1/2 py-10">
    <h2 class="text-xl mb-5 font-semibold underline underline-offset-8"> Team Password</h2>
    <div class="flex flex-col gap-y-5">
        <div class="flex items-center space-x-2 mt-5">
            <Label for="allow_join_via_password" class="text-md">Allow Join Via Password</Label>
            <Switch id="allow_join_via_password" bind:checked={join_via_password_checked} onCheckedChange={toggle_allow_join_via_password} />
            {#if join_via_password_error_message}
                <p class="text-red-500">{join_via_password_error_message}</p>
            {/if}
        </div>

        <h2 class="text-md mt-5 font-semibold ">Set/Update Password</h2>


        <form  on:submit|preventDefault={set_password} class="flex flex-col w-full gap-y-5"  >
            <Input name="password" type="password" placeholder="Password"/>
            <Input name="confirm_password" type="password" placeholder="Confirm Password"/>
            {#if pass_error}
                <p class="text-red-500">{pass_error}</p>
            {/if}
            <Button type="submit" class="w-full">Save</Button>
        </form>
    </div>
</div>

<div class="w-full md:w-1/2 py-10">
    <h2 class="text-xl mb-5 font-semibold underline underline-offset-8">Delete Team</h2>
    <p class="text-md my-4">Don't feel like participating in this contest? You can delete your team here.</p>
    <Button variant="destructive" class="w-full" on:click={show_delete_team_dialog}>Delete Team</Button>
</div>


</div>