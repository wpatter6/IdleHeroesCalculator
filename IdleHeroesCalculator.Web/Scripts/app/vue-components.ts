declare var Vue: any;

Vue.component("filter-item", {
    props: ["img", "name", "id"],
    template:   `<li class="fitem">
                    <span>
                        <input type="checkbox" class="fcheck" :id="id" />
                        <i class="icon-ok checkmark"></i>
                        <span v-if="img"><img :src="img" class="fimg" /></span>
                        <span>
                            {{name}}
                        </span>
                    </span>
                </li>`});

Vue.component("filter-items", {
    props: ["factions", "roles", "filter", "min-stars", "max-stars"],
    template: `<ul class="flist">
                    <filter-item v-for="r in roles" :img="r.img" :name="r.name" :id="'r-' + r.id" :key="'role-' + r.id" @click.native="filter"></filter-item>
                    <li class="fseperator"/>
                    <filter-item v-for="f in factions" :img="f.img" :name="f.name" :id="'f-' + f.id" :key="'faction-' + f.id" @click.native="filter"></filter-item>
                    <li class="fseperator"/>
                    <filter-item v-for="s in maxStars-minStars" :name="maxStars - s + 1 + ' star'" :id="'s-' + (maxStars - s + 1)" :key="'star-' + (maxStars - s + 1)" @click.native="filter"></filter-item>
                </ul>`});