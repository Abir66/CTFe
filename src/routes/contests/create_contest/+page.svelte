<script lang="ts">
 import { Input } from "$lib/components/ui/input";
 import { Label } from "$lib/components/ui/label";
 import { Button } from '$lib/components/ui/button';
 import * as Select from "$lib/components/ui/select";
  let selectedItem = "public";
  export let form;
</script>


<h1 class="py-12 text-xl font-bold mr-8 text-center"> Create Contest</h1> 

<form  method="post" >
     
    <div class="flex flex-row justify-center ">
        <div class="flex flex-col lg:basis-1/2 space-y-6 basis-full ">
            <Label for="title">Title</Label>
            <Input type="text" name="title"  placeholder="name of the contest" >title</Input>
            <Label for="type">Type</Label>
            <Select.Root  >
                <Select.Trigger >
                  <Select.Value placeholder="Select a type" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.Item value="private" on:click={() => {selectedItem="private"}}>private</Select.Item>
                    <Select.Item value="public"on:click={() => {selectedItem="public"}} >public</Select.Item>
                  </Select.Group>
                </Select.Content>
                <Select.Input name="type" />
              </Select.Root>
              {#if selectedItem === "private"}
              <Label for="password">Password</Label>
              <Input type="password" name="password" placeholder="password for the private contest" autocomplete="new-password">password</Input>
              {/if}
              <Label for="begin">Begin</Label>
              <div class="flex flex-row justify-between begin space-x-2">
              <Input type="date" name="begindate"></Input>
              <Input type="time" name="begintime"></Input>
               </div>
               {#if form?.begindatebeforenow}
               <span class="invalid">Invalid start time</span>
                {/if}
              <Label for="end">End</Label>
              <div class="flex flex-row justify-between end space-x-2">
                <Input type="date" name="enddate"></Input>
                <Input type="time" name="endtime"></Input>
              </div>
              {#if form?.enddatebeforebegindate}
              <span class="invalid"> Start date must be before end date </span>
               {/if}
              <Label for="maxmember">Max member</Label>
            <Input type="number" name="maxmember" min={0}>maxmember</Input>
            {#if form?.emptyfields}
            <span class="invalid"> Fill up every field </span>
             {/if}
        </div>
        
    </div>
    <div class="mt-6 flex items-center justify-center gap-x-6">
        <Button type="submit" class="hover:invert">Create Contest</Button>
        <!-- <button type="submit" class="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white dark:text-black dark:bg-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create</button> -->
    </div>
    
  </form>



<style>
      .invalid {
    color: red;
}

</style>

