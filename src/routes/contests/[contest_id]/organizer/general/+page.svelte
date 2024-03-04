<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
    import * as Select from "$lib/components/ui/select";
    import * as Dialog from "$lib/components/ui/dialog";
    import { enhance } from '$app/forms';
    import { toast } from "svelte-sonner";
    import { Switch } from "$lib/components/ui/switch";
    let selectedItem = "public";
    export let data;
    export let form;
    let startdate;
    let endtime;
    let starttime;
    let enddate;

  let registration_paused = data.contest_details.registration_paused;
   
  $: startdate = new Date(data.contest_details.start_time).toISOString().split('T')[0];

  $: enddate = new Date(data.contest_details.end_time).toISOString().split('T')[0];
  $: starttime= new Date(data.contest_details.start_time).toISOString().split('T')[1].split('.')[0];
  $: endtime= new Date(data.contest_details.end_time).toISOString().split('T')[1].split('.')[0];

  let delete_dialog_open = false;
  function show_delete_dialog() {
      delete_dialog_open = true;
  }

    let invite_string  = "";
    let timer;
    let invite_error = "";
    let users : any[] = [];
    $: invited_members = data.invited_members;
    let org_invitation_open = false;
    function org_invitation_dialog() {
        users = [];
        invite_string = ''
        org_invitation_open = true;
        invite_error = ''
        
    }
    let contest_id  = data.contest_id;
    async function handleInviteInput(event){
        invite_string = event.target.value;

        clearTimeout(timer);
        if(invite_string.length < 3){
            return;
        }
        timer = setTimeout(() => {
            console.log("Search string org:", invite_string);
            console.log("Search string:", invite_string);
            fetch(`/api/organizer_invites/send?invite_string=${invite_string}&contest_id=${data.contest_id}`)
            .then(response => response.json())
            .then(data => {
                let result = data;
                if(result.response.data.length == 0){
                    invite_error = "No user found";
                }
                else{
                    invite_error = "";
                }
                users = result.response.data;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
        }, 500);
    }

    

    async function send_invitation(user_id,username){
        console.log(user_id,username);
        const response = await fetch(`/api/organizer_invites/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({invitee_id:user_id,contest_id:data.contest_id})
        })
        const responseData = await response.json()
        if(!responseData.success){
            if(responseData.message) invite_error = responseData.message        
            else toast("Something went wrong. Please try again.")
        }
        if(responseData.response.success == true){
          invite_error = "success";
        }
        if(responseData.response.success){
            invited_members.push({invitee_id:user_id,username:username});
            invited_members = invited_members;
            users = [];
            invite_string = ''
            invite_error = ''
            toast('Invitation sent successfully');
        }
    }

    async function remove_invited_member(user_id,index){
      toast('Removing invited member');
      
      const response = await fetch(`/api/organizer_invites/remove`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({invitee_id:user_id,contest_id:contest_id})
      });
      const data = await response.json();
      invited_members.splice(index,1);
      toast(data.message)
    }

</script>
<Dialog.Root bind:open={org_invitation_open} onOpenChange={(open) => {if (!open) {org_invitation_open = false;}}}>
  <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
          <Dialog.Title>Add Organizer</Dialog.Title>
      </Dialog.Header>
      <Dialog.Description>
          <form  class="flex flex-col w-full gap-y-5"  >
              <Input bind:value={invite_string} name="invite" on:input={handleInviteInput} type="text" placeholder="Enter username" autocomplete="off"/>
              {#if invite_error == "success"}
                  <p class="text-green-500">{invite_error}</p>
              {:else if invite_error}
                  <p class="text-red-500">{invite_error}</p>
              {/if}
              {#each users as user,index (user)}
                  <div class="flex justify-between">
                      <div class="flex font-semibold text-lg gap-x-2 align-baseline">
                          <a class="hover:underline" href="/user/{user.id}">{user.username}</a>
                      </div>
                      <Button class="text-sm" on:click={()=>{send_invitation(user.id,user.username)}}>Invite</Button>
                  </div>
              {/each}
          </form>
      </Dialog.Description>
  </Dialog.Content>
</Dialog.Root>
   
    <form  method="post" class="p-20" action="?/edit" use:enhance={()=>{toast('Updating Contest...')}}>  
        <div class="flex flex-col">
            <div class="flex flex-col lg:basis-1/2 space-y-6 basis-full ">
                <Label for="title">Title</Label>
                <Input type="text" name="title"  placeholder="name of the contest" bind:value={data.contest_details.contest_name} >title</Input>
                <Label for="type">Type</Label>
                <Select.Root  >
                    <Select.Trigger >
                      <Select.Value placeholder="Select a type"  />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Group>
                        <Select.Item value="private" on:click={() => {selectedItem="private"}}>private</Select.Item>
                        <Select.Item value="public"on:click={() => {selectedItem="public"}} >public</Select.Item>
                      </Select.Group>
                    </Select.Content>
                    <Select.Input name="type" bind:value={data.contest_details.type} />
                  </Select.Root>
                  {#if selectedItem === "private" || data.contest_details.type === "private"}
                  <Label for="password">Password</Label>
                  <Input type="password" name="password" placeholder="password for the private contest" autocomplete="new-password" bind:value={data.contest_details.contest_password} >password</Input>
                  {/if}
                  <Label for="begin">Begin</Label>
                  <div class="flex flex-row justify-between begin space-x-2">
                <Input type="date" name="begindate" bind:value={startdate}></Input>
                  <Input type="time" name="begintime" bind:value={starttime}></Input>
                   </div>
                   <!-- {#if form?.begindatebeforenow}
                   <span class="invalid">Invalid start time</span>
                    {/if} -->
                  <Label for="end">End</Label>
                  <div class="flex flex-row justify-between end space-x-2">
                    <Input type="date" name="enddate" bind:value={enddate} ></Input>
                    <Input type="time" name="endtime" bind:value={endtime}></Input>
                  </div>
                  {#if form?.enddatebeforebegindate}
                  <span class="invalid"> Start date must be before end date </span>
                   {/if}
                  <Label for="maxmember">Max member</Label>
                <Input type="number" name="maxmember" min={0} bind:value={data.contest_details.memberlimit}>maxmember</Input>
                

                <div class="flex items-center space-x-2 mt-5">
                    <Label for="registration_paused2" class="text-md">Registration Paused</Label>
                    <Switch id="registration_paused2" bind:checked={registration_paused}/>
                </div>

                <input hidden name="registration_paused" bind:value={registration_paused} />
               
                {#if form?.emptyfields}
                    <span class="invalid"> Fill up every field </span>
                {/if}

                <Button type="submit">Save</Button>

            </div>
            
        </div>

    </form>



      <!-- <div class="py-8 text-lg font-bold p-20"> Created by: <span class="font-normal">{data.contest_details.created_by}</span> </div>  -->
      <div class="py-4 text-lg font-bold p-20"> Collaborators </div>
      <div class="p-20">
          {#each data.organizers as organizer,index }
            <div  class="flex py-2 justify-between ">
              <div class="flex font-semibold text-lg gap-x-2 align-baseline">
                {index+1}.&nbsp;&nbsp;
                <a class="hover:underline" href="/users/1">{organizer.username}</a>
              </div>
            </div>
          {/each}
          {#each invited_members as member,index (member)}
              <div class="flex py-2 justify-between">
                  <div class="flex font-semibold text-lg gap-x-2 align-baseline">
                      {data.organizers.length + index+1}.&nbsp;&nbsp;
                      <a class="hover:underline" href="/users/1">{member.username}</a>
                      <div class="text-sm text-gray-500 dark:text-gray-500">(pending)</div> 
                  </div>
                
                  <Button class="text-sm" variant="outline" on:click={()=>{remove_invited_member(member.invitee_id,index)}}>Remove</Button>
              </div>
              
              <Separator />
          {/each}
          <Button type="submit" class="w-full mt-5" on:click={org_invitation_dialog}> + Invite user</Button> 
          

      </div> 

      <Separator class="my-4  mx-6" /> 

    <!-- delete contest  -->
    <h1 class="py-8 text-xl font-bold p-20"> Delete Contest</h1>
    <div class="flex flex-row px-20">
        <div class="flex flex-col lg:basis-1/2 space-y-6 basis-full ">
            <p class="text-muted-foreground text-sm">Want to delete this contest? This action cannot be undone. All Data will be deleted</p>
            <div class="mt-6 flex items-center justify-start gap-x-6">
              <Button type="submit" class="hover:invert" >+Add Collaborator</Button>
              <!-- <button type="submit" class="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white dark:text-black dark:bg-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create</button> -->
          </div>
          </div>
          
      </div>
      
      
    </form>
    <Separator class="my-4  mx-6" /> 

  <!-- delete contest  -->
  <h1 class="py-8 text-xl font-bold p-20"> Delete Contest</h1>
  <div class="flex flex-row px-20">
      <div class="flex flex-col lg:basis-1/2 space-y-6 basis-full ">
          <p class="text-muted-foreground text-sm">Want to delete this contest? This action cannot be undone. All Data will be deleted</p>
          <div class="mt-6 flex items-center justify-start gap-x-6">
              <Button variant="destructive" on:click={show_delete_dialog}>Delete Contest</Button>
          </div>
      </div>
  </div>


<Dialog.Root bind:open={delete_dialog_open} onOpenChange={(open) => {if (!open) {delete_dialog_open = false;}}}>
      <Dialog.Content class="sm:max-w-[425px]">
          <Dialog.Header>
              <Dialog.Title>Delete Contest</Dialog.Title>
          </Dialog.Header>
          <Dialog.Description>
              Are You sure you want to delete this contest? This action cannot be undone.
          </Dialog.Description>
          <Dialog.Footer>
              <form use:enhance={()=>{toast('Deleting Contest...')}}  method="post" action="?/delete"> 
                  <Button type="submit" variant="destructive">Yes, Delete</Button>
              </form>
          </Dialog.Footer>
      </Dialog.Content>
  </Dialog.Root>
 
<style>
  .invalid {
     color: red;
  }
 
</style>
 
 