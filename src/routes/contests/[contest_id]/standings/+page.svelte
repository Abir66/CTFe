<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Table from "$lib/components/ui/table";
    export let data;
    import { goto } from '$app/navigation';
    console.log(data);


  </script>

<Card.Root class="p-7">
  <Card.Content>
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head >Place</Table.Head>
          <Table.Head class="">Team</Table.Head>
          <Table.Head class="text-right">Points</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        
        {#each  data.standings as team,index}
          <Table.Row class="text-justify py-0 text-lg" >
                <Table.Cell class="font-xl">{index+1}</Table.Cell>
                <Table.Cell  ><a href={`/teams/${team.team_id}`} class="custom_center ">{team.name}</a></Table.Cell>
                <Table.Cell class="text-right">{team.final_score}</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>

  



  <style>
    .custom_center{
      text-align: center;
      color: rgb(0, 102, 255);
    }
    .custom_center:hover{
      text-decoration: underline;
    }
  </style>