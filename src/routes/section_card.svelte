<script lang="ts">
    export let icon_path: string;
    export let title: string;
    export let icon_alt = "";
</script>

<div class="flex aspect-square w-3/4 sm:w-1/2 lg:w-1/4 flex-col justify-center border-[3px] border-primary p-10 align-middle">
    <div class="items-middle m-auto flex aspect-square w-1/2 justify-center">
        <img
            class="m-auto w-full"
            src="{icon_path}"
            alt="{icon_alt}"
        />
    </div>

    <h2 class="mt-3 scroll-m-20 text-center text-2xl font-extrabold">
        {title}
    </h2>
</div>