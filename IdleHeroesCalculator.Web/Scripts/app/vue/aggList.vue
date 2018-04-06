<template>
    <div>
        <div class="stickyHeader"><h2>FUSION COSTS</h2></div>
        <span class="calcamt spirit"><span class="hcount">{{spirit}}</span></span>
        <span class="calcamt gold"><span class="hcount">{{gold}}</span></span>
        <span class="calcamt stones"><span class="hcount">{{stones}}</span></span>
        <transition-group name="clist" tag="span" class="hcalc">
            <hero-item v-for="hero in aggregates" v-if="hero.count" :showCount="1" :hero="hero" :key="hero.name + '-' + hero.stars" class="cursor-default"></hero-item>
        </transition-group>
    </div>
</template>

<script>
    export default {
        props: ["spirit", "gold", "stones", "aggregates"]
    }
</script>