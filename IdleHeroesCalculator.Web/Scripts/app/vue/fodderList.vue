<template>
    <span v-if="fodder && fodder.length" class="fodder">
        <label v-for="f in fodder" :id="f.id" class="citem">
            <hero-item :showCount="0" :hero="f"></hero-item>
            <input type="checkbox" v-model="f.owned" v-on:change="change(f)" />
            <span class="checkmark shade"><i class="icon-ok"></i></span>
        </label>
    </span>
</template>

<style lang="less" scoped>
    @import "../../../Styles/mixins.less";

    .fodder {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        & > * {
            max-width: 30%;
        }
    }

    label {
        position: relative;
        display: inline-block;
        width: 59px;
        height: 59px;
        padding: 0;

        .checkmark {
            .border-radius(19%);
            position: absolute;
            display: inline-block;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            text-align: center;
            padding-top: 8%;
            z-index: 10;
            cursor: pointer;

            i {
                font-size: 2rem;
            }
        }
        
        .hero {
            padding: 0;

            .star {
                bottom: 7% !important;
            }

            .himg {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>

<script>
    export default {
        props: ["fodder", "change"]
    }
</script>