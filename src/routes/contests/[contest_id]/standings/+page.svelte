<script lang="ts">
    import * as Table from "$lib/components/ui/table";
    export let data;
    console.log(data.standings);
  </script>
  
  <Table.Root>
    
    <Table.Header>
      <Table.Row>
        <Table.Head >Place</Table.Head>
        <Table.Head class="text-center">Team</Table.Head>
        <Table.Head class="text-right">Points</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each  data.standings as team}
        <Table.Row class="text-justify">
          <Table.Cell class="font-medium">{team.place}</Table.Cell>
          <Table.Cell  ><a href={`/contests/${data.contest_id}/${team.team_id}`} class="custom_center ">{team.team_name}</a></Table.Cell>
          <Table.Cell class="text-right">{team.Points}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>


  <style>
    .custom_center{
      text-align: center;
      color: rgb(0, 102, 255);
    }
    .custom_center:hover{
      text-decoration: underline;
    }
  </style>