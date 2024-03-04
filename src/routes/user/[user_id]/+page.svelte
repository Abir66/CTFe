<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import  Cards from "../[user_id]/cards.svelte";
	import { Progress } from "$lib/components/ui/progress";
	let value=20;
	export let data;
	const getcount=(count)=>{
		if (count==null){
			return 0;
		}
		else{
			return (count);
		}
	}
</script>


<div class=" flex-col md:flex">

	<div class="flex-1 space-y-4 p-8 pt-6">
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card.Root class="row-span-2 ">
						<Card.Header
							class="flex flex-row items-center justify-center space-y-0 "
						>
						 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg5wFV55vwhHoqU63im6UvUTdKcuHjUZGdaA&usqp=CAU" alt="no profile" class="size-30">
						</Card.Header>
						<Card.Content>
							<div class="text-xl font-bold">{data.username}</div>
							<p class="text-xs text-muted-foreground">JOINED {(new Date(data.created_at)).toDateString()}</p>
						</Card.Content>
					</Card.Root>
			        
					<Cards count={data.contest_count} type="contests" user_id={data.id} path="contests/participation"/>
					<Cards count={data.problem_count} type="problem solved" user_id={data.id} path="problems"/>
					<Cards count={data.blogs_count} type="Blogs" user_id={data.id} path="blogs"/>
					<Cards count=12 type="Created problem" user_id={data.id} path="contests/participation"/>
					<Cards count={data.contest_organized} type="Organized contests" user_id={data.id} path="contests/organization"/>
		
				</div>
				<div >
					<Card.Root >
						<Card.Header>
							<Card.Title class="text-xl">Solved</Card.Title>
						</Card.Header>
						<Card.Content>
                         <div class="flex flex-col space-y-5">
							{#each data.solved_stat_category as problem}
								<div class="flex flex-row items-center  space-x-8 ">
									<p class="text-sm font-bold basis-1/5 ">{problem.category}<span class="text-muted-foreground ml-3.5">({getcount(problem.count)}/{problem.total})</span></p>
								
									<Progress value={getcount(problem.count)} max={problem.total} class="w-[60%] basis-4/5" />
								</div>
							{/each}
						
						
						 </div>
						
							
							
						</Card.Content>
					</Card.Root>
					
				</div>
			
	</div>
</div>