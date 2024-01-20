<script>
    export let data = [];
    let isOpen = false;
    let items = ["Item 1", "Item 2", "Item 3"];
    let buttonText = "Dropdown";
    let catagories = ["cryptograpgy","OSINT","steganography","web","forensics"];

    function changeButtonText(selectedItem) {
        buttonText = selectedItem;
        isOpen = !isOpen;
    }

    function addCatagory() {
        let newCatagory = buttonText;
        catagories.push(newCatagory);
        buttonText = "Dropdown";
    }
</script>

<h1 class="mb-2 text-3xl font-bold leading-none tracking-tight text-gray-900  dark:text-white">Problems</h1>
<hr class="w-48 h-1 bg-black border-0 rounded dark:bg-gray-700">
<div class='flex w-3/4 items-center border-b-2 border-b-black py-2 dark:border-gray-700 '>
    <p class='w-1/4 px-4 lg:text-lg'>Problem</p><p class='w-1/4 px-4 lg:text-lg'>Date</p><p class='w-1/4 px-4 lg:text-lg'>Category</p><p class='w-1/4 px-4 lg:text-lg'>Contest</p>
</div>

<div class="float-right p-4  w-1/4">
    <form class="block max-w-sm p-6 border-2 border-black dark:border-gray-700 ">
            <label for="default-search" class="mb-2 text-xs font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="search" id="default-search" class="block w-full p-4 ps-10 text-xs text-gray-900 border border-gray-300"  placeholder="Search Problems" >
            </div>
            
            <div class="relative">
                <div class="flex">
                    <button id="filter_add" class="px-6 w-3/4 py-2 mt-4 mr-1 border border-black dark:border-gray-700 " on:click={() => (isOpen = !isOpen)}>
                        {buttonText}
                      </button>
                      <button id="filter_dropdown" class=" w-1/4 py-2 mt-4 ml-1 border text-center border-black dark:border-gray-700 " on:click={() => addCatagory()}>
                          Add
                      </button>
                </div>
                {#if isOpen}
                  <div class="absolute left-0 w-48 py-2 mt-2 mr-10 bg-white rounded-lg shadow-xl">
                    {#each items as item (item)}
                    <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white" on:click={() => changeButtonText(item)}>
                        {item}
                    </a>
                    {/each}
                  </div>
                {/if}
            </div>
            <div class="flex">
                <div class="py-1 mt-2">
                    {#each catagories as catagory(catagory)}
                        <a href="#" class="border border-black dark:border-gray-700 px-1 py-1 text-gray-800 rounded-lg ">
                            {catagory}
                            <button>x</button>
                        </a>
                    {/each}
                  </div>
            </div>
    
        </form> 
</div>
   

{#each data.problems as item}
    <div class='flex w-3/4 items-center rounded border-2 border-black my-2 dark:border-gray-700 '>
        <p class='w-1/4 lg:text-lg p-4 '>{item.problem_name}</p><p class='w-1/4 text-base md:test-lg lg:text-lg p-4 '>{item.date}</p><p class='w-1/4 lg:text-lg p-4 '>{item.category}</p><p class='w-1/4 lg:text-lg p-4 '>{item.contest}</p>
    </div>
{/each}