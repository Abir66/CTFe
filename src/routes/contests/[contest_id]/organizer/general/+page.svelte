<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
    import * as Select from "$lib/components/ui/select";
	import { log10 } from "chart.js/helpers";
	
  import * as Dialog from "$lib/components/ui/dialog";
    import { enhance } from '$app/forms';
    import { toast } from "svelte-sonner";
    import { Switch } from "$lib/components/ui/switch";
     let selectedItem = "";
     export let form;
     export let data;
     let startdate;
     let endtime ;
     let starttime ;
     let enddate ;
     console.log("hehe",data.contest_details);
    startdate = new Date(data.contest_details.start_time).toISOString().split('T')[0];
     enddate = new Date(data.contest_details.end_time).toISOString().split('T')[0];
     starttime= new Date(data.contest_details.start_time).toLocaleTimeString().split(':')[0]+":"+new Date(data.contest_details.start_time).toLocaleTimeString().split(':')[1]+" "+new Date(data.contest_details.start_time).toLocaleTimeString().split(' ')[1]  ;
     endtime=new Date(data.contest_details.end_time).toLocaleTimeString().split(':')[0]+":"+new Date(data.contest_details.end_time).toLocaleTimeString().split(':')[1]+" "+new Date(data.contest_details.end_time).toLocaleTimeString().split(' ')[1];
     $: console.log(starttime);


     let delete_dialog_open = false;
    function show_delete_dialog() {
        delete_dialog_open = true;
    }

     
  </script>
   
   
    <form  method="post" class="p-20" action="?/edit" use:enhance={({ formData }) => {
      // Remove the unnecessary code block
             if(formData.get('type')=="")
             {
                   formData.append('type',data.contest_details.type);
             }
             
       
    }}>  
        <div class="flex flex-row">
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
                    <Select.Input name="type" />
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
      {#each data.organizers as organizer }
        <div  class="py-2 text-sm font-bold p-20 ">
          <a href="/user/{organizer.id}" >{organizer.username}</a>
        </div>
      {/each}
      <form  method="post" class="px-20 py-10" action="?/addcollab">  
        <div class="flex flex-row">
            <div class="flex flex-col lg:basis-1/2 space-y-6 basis-full ">
              
              <Input type="text" name="username"  placeholder="Enter username of the collaborator" ></Input>
              {#if form?.usernotfound}
              <span class="invalid"> No user found with this name </span>
               {/if}
               {#if form?.alreadycollab}
               <span class="invalid"> Already is in the organizer's list </span>
                {/if}
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
   
   