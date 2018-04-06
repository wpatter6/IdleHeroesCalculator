<template>
    <li class="fitem">
        <span>
            <input type="checkbox" class="fcheck" :id="id" />
            <i class="icon-ok checkmark"></i>
            <span v-if="img"><img :src="img" class="fimg" /></span>
            <span>
                {{name}}
            </span>
        </span>
    </li>
</template>

<script>
    export default {
        props: ["img", "name", "id"]
    }
</script>