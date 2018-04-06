<template>
    <transition-group name="fdrawer" class="overflow-hidden" tag="div">
        <div v-if="showFilter" :key="1">
            <h4><i class="icon-filter"></i>FUSION FILTERS</h4>
            <div id="filters" class="flist">
                <filter-items :factions="factions" :roles="roles" :filter="filter" :min-stars="5" :max-stars="10"></filter-items>
            </div>
        </div>
        <div v-else class="calcagg" :key="2">
            <h4><i class="icon-filter"></i>SELECT OWNED</h4>
            <fodder-list :change="heroChange" :fodder="fodder"></fodder-list>
        </div>
    </transition-group>
</template>

<script>
    export default {
        props: ["showFilter", "factions", "roles", "filter", "heroChange", "fodder"]
    }
</script>