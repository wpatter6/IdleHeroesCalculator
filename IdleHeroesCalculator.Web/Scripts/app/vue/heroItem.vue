<template>
    <span :class="'hero s' + hero.stars" :id="hero.name + '-' + hero.stars">
        <img :src="hero.img" class="himg" />
        <span v-if="hero.count > 0" class="hcount">{{hero.count}}</span>
        <span v-if="hero.stars && hero.stars > 5 && hero.stars < 10" class="stars">
            <img v-for="s in hero.stars - 5" src="/img/redstar.png" class="star h9" />
        </span>
        <span v-else-if="hero.stars && hero.stars < 6" class="stars">
            <img v-for="s in hero.stars" src="/img/yellowstar.png" class="star h5" />
        </span>
    </span>
</template>

<style lang="less" scoped>
    @import "../../../Styles/variables.less";

    .hero {
        position: relative;
        display: inline-block;
        transition: all @transition-time;
        padding: 10px;
        cursor: pointer;
        
        .star {
            position: absolute;
            z-index: 2;
            bottom: 12%;
            
            &.h9 {
                height: 22%;
            }

            &.h5 {
                height: 18%;
            }
        }

        &.s9 > .stars > img {
            &:nth-last-of-type(1) {
                left: 23%;
            }

            &:nth-last-of-type(2) {
                left: 33%;
            }

            &:nth-last-of-type(3) {
                left: 43%;
            }

            &:nth-last-of-type(4) {
                left: 53%;
            }

        }

        &.s8 > .stars > img {
            &:nth-last-of-type(1) {
                left: 30%;
            }

            &:nth-last-of-type(2) {
                left: 41%;
            }

            &:nth-last-of-type(3) {
                left: 52%;
            }
        }

        &.s7 > .stars > img {
            &:nth-last-of-type(1) {
                left: 33%;
            }

            &:nth-last-of-type(2) {
                left: 47%;
            }
        }

        &.s6 > .stars > img {
            left: 40%;
        }

        &.s5 > .stars > img {
            &:nth-last-of-type(1) {
                left: 18%;
            }

            &:nth-last-of-type(2) {
                left: 29.5%;
            }

            &:nth-last-of-type(3) {
                left: 41%;
            }

            &:nth-last-of-type(4) {
                left: 52.5%;
            }

            &:nth-last-of-type(5) {
                left: 64%;
            }
        }

        &.s4 > .stars > img {
            &:nth-last-of-type(1) {
                left: 23%;
            }

            &:nth-last-of-type(2) {
                left: 35%;
            }

            &:nth-last-of-type(3) {
                left: 47%;
            }

            &:nth-last-of-type(4) {
                left: 59%;
            }
        }

        &.s3 > .stars > img {
            &:nth-last-of-type(1) {
                left: 30%;
            }

            &:nth-last-of-type(2) {
                left: 41%;
            }

            &:nth-last-of-type(3) {
                left: 52%;
            }
        }

        .himg {
            width: 100%;
        }
    }
</style>

<script>
    export default {
        props: ["hero", "showCount"]
    }
</script>