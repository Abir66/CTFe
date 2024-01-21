<script>
   export let contest ={
     
    };
</script>


<div class="contentHolder flex flex-row ">

  <div class="content basis-1/4 text-sm ">
   {contest.contest_name}
  </div>
  <div class="content basis-1/4 text-sm">
    {contest.start_time}
  </div>
  <div class="content basis-1/4 text-sm"> 
   {contest.duration}
  </div>

  <div class="content basis-1/4 text-sm">
    <a href={`/contests/${contest.contest_id}`} class="link">GO TO CONTEST</a>
  </div>
</div>

<style>
    .contentHolder{
        border: 3px solid black;
        margin: 1.5rem;
        padding: 1rem
    }
   .link{
     font-size: 0.75rem;
   }
   .link:hover{
       text-decoration: underline;
   }
   .content{
         text-align: center;
   }
</style>