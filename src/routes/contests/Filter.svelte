<script>
	 import { goto } from '$app/navigation';

  
	let status = ['all'];
	console.log(status);

    let type = ['all'];
  
    const Filter = () => {
        
        let url = '/contests?';
        if(search != '')
        {
            url += `search=${search}&`;
        }
        if(status.length > 0)
        {
            url += `status=${status.join('&status=')}&`;
        }
        if(type.length > 0)
        {
            url += `type=${type.join(',')}&`;
        }
        goto(url);
    }
    let search = '';

</script>

<div class="Container">

    <input type="text" placeholder="Search contest" bind:value={search}>

    <div class="status">
        <div class="content">
            <label>
                <input type="checkbox" bind:group={status} value="all" />
                All
            </label>
        </div>
        <div class="content">
            <label>
                <input type="checkbox" bind:group={status} value="current" />
                Current Contests
            </label>
        </div>
        <div class="content">
            <label>
                <input type="checkbox" bind:group={status} value="upcoming" />
                Upcoming Contests
            </label>
        </div>
    
        <div class="content">
            <label>
                <input type="checkbox" bind:group={status} value="past" />
                Past Contests
            </label>
        </div>
    </div>
     <hr>
    <div class="type">
        <div class="content">
            <label>
                <input type="checkbox" bind:group={type} value="all" />
                All
            </label>
        </div>
        <div class="content">
            <label>
                <input type="checkbox" bind:group={type} value="Public" />
                Public Contests
            </label>
        </div>
        <div class="content">
            <label>
                <input type="checkbox" bind:group={type} value="Official" />
                Official Contests
            </label>
        </div>
    
        <div class="content">
            <label>
                <input type="checkbox" bind:group={type} value="Private" />
                Private Contests
            </label>
        </div>

        <div class="content">
            <label>
                <input type="checkbox" bind:group={type} value="MyParticipations" />
                My Participations
            </label>
        </div>
        <div class="content">
            <label>
                <input type="checkbox" bind:group={type} value="MyArrangements" />
                My Arrangements
            </label>
        </div>
    </div>

 
	 <button on:click={Filter}>
            Apply Filters
     </button>
</div>


<style>
    .Container{
        
        color: black;
        padding: 2rem;
        border: 2px solid black;
       
    }

    input[type="checkbox"]{
        margin-right: 0.5rem;
        accent-color: black;
    }
  
    hr{
        width: 100%;
        margin: 2rem auto;
        border-top: 1px solid black;
    }
    .content{
        margin: 0.3rem 0;
        font-size:0.8rem;
    }
    
    button
    {
        margin-top: 2rem;
        padding: 0.3rem 0.5rem;
        background-color: black;
        color: white;
        font-size: 0.8rem;
        cursor: pointer;
        margin-left: 50%;
    }
  
   input[type="text"]{
       width: 100%;
       padding: 0.5rem;
       margin-bottom: 1rem;
       border: 1px solid black;
       font-size: small;
       border-radius: 5px;
   }
</style>

