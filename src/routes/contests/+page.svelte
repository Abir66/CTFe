<script>
    import SimpleCard from '../../Mycomponents/SimpleCard.svelte';
    import Filter from './Filter.svelte';
    export let data;  
</script>

<div class="lg:flex  flex-row lg:space-x-24" >

   <div class="basis-3/4 ">
    {#if data.current.length > 0}
    <div class="Container" >
       <div class="title">
           CURRENT CONTESTS 
       </div>
      <div class="HeaderContainer flex flex-row">
       <div class="basis-1/4 content">
           NAME
       </div>
       <div class="basis-1/4 content" >
       DATE
       </div>
       <div class="basis-1/4 content">
       DURATION
       </div>
       <div class="basis-1/4 content">
   
       </div>
      </div>
       {#each data.current as contest}
       <SimpleCard contest={contest} />
       {/each}
   
      </div >
   
    {/if}
     {#if data.upcoming.length > 0}
     <div class="Container">
        <div class="title">
            UPCOMING CONTESTS 
        </div>
       <div class="HeaderContainer flex flex-row">
        <div class="basis-1/4 content">
            NAME
        </div>
        <div class="basis-1/4 content" >
        DATE
        </div>
        <div class="basis-1/4 content">
        DURATION
        </div>
        <div class="basis-1/4 content">
    
        </div>
       </div>
        {#each data.upcoming as contest}
        <SimpleCard contest={contest} />
        {/each}
    
       </div >
    
     {/if}

     {#if data.past.length > 0}
     <div class="Container">
        <div class="title">
            PAST CONTESTS 
        </div>
       <div class="HeaderContainer flex flex-row">
        <div class="basis-1/4 content">
            NAME
        </div>
        <div class="basis-1/4 content" >
        DATE
        </div>
        <div class="basis-1/4 content">
        DURATION
        </div>
        <div class="basis-1/4 content">
    
        </div>
       </div>
        {#each data.past as contest}
        <SimpleCard contest={contest} />
        {/each}
    
       </div >
    
     {/if}

    </div>

   
   <div class="basis-1/4  filter sm:mx-24 " >
      <Filter/>
   </div>

</div>


<style>
    .HeaderContainer{
        
        margin-left: 1.5rem;
        margin-top: 1.5rem;
        
        padding-left: 1rem;
    }

    .title
    {
        font-size: 1.3rem;
        font-weight: bold;
        margin: 1.5rem;
        padding-bottom: 1rem;
        text-decoration: underline;
    }
    .content
    {
        text-align: center;
        font-weight: bold;
    }
    .Container{
        margin-top: 5rem;
    }
    .filter{
        margin-top: 5rem;
        
    }
</style>