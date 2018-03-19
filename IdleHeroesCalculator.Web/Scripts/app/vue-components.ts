declare var Vue: any;

Vue.component("filter-item", {
    props: ["img", "name", "id", "filter"],
    template:   `<li class="fitem" @click.native="filter">
                    <label>
                        <input type="checkbox" class="fcheck" />
                        <i class="icon-ok checkmark"></i>
                        <span><img :src="img" class="fimg" /></span>
                        <span class="fname">
                            {{name}}
                        </span>
                    </label>
                </li>`});

Vue.component("filter-items", {
    props: ["factions", "roles"],
    template: `<ul class="flist">
                    <filter-item v-for="f in factions" :img="f.img" :name="f.name" :id="f.id" :key="'faction-' + f.id"></filter-item>
                    <li class="fseperator"/>
                    <filter-item v-for="r in roles" :img="r.img" :name="r.name" :id="r.id" :key="'role-' + r.id"></filter-item>
                </ul>`});