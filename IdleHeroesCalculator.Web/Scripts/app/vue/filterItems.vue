<template>
    <ul class="flist">
        <filter-item v-for="r in roles" :img="r.img" :name="r.name" :id="'r-' + r.id" :key="'role-' + r.id" @click.native="filter"></filter-item>
        <li class="fseperator" />
        <filter-item v-for="f in factions" :img="f.img" :name="f.name" :id="'f-' + f.id" :key="'faction-' + f.id" @click.native="filter"></filter-item>
        <li class="fseperator" />
        <filter-item v-for="s in maxStars - minStars + 1" :name="maxStars - s + 1 + ' star'" :id="'s-' + (maxStars - s + 1)" :key="'star-' + (maxStars - s + 1)" @click.native="filter"></filter-item>
    </ul>
</template>

<script>
    import filterItem from './filterItem.vue'

    export default {
        props: ["factions", "roles", "filter", "min-stars", "max-stars"],
        components: {
            'filter-item': filterItem
        }
    }
</script>