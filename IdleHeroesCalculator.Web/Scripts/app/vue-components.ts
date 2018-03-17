declare var Vue: any;

Vue.component("filter-item", {
    template:   `<li class="fitem">
                    <input type="checkbox" class="fcheck" />
                    <img :src="img" class="fimg" />
                    <span class="fname">
                        {{name}}
                    </span>
                </li>`});

Vue.component("filter-items", {
    template: `<ul class="flist">
                    <filter-item v-repeat="factions"></filter-item>
                    <li class="fseperator"/>
                    <filter-item v-repeat="roles"></filter-item>
                </ul>`
});

Vue.component("filter-items2", {
    template:   `<ul class="flist">
                    <li class="fitem" v-repeat="factions">
                        <input type="checkbox" class="fcheck" />
                        <img :src="img" class="fimg" />
                        <span class="fname">
                            {{name}}
                        </span>
                    </li>
                    <li class="fseperator"/>
                    <li class="fitem" v-repeat="roles">
                        <input type="checkbox" class="fcheck" />
                        <img :src="img" class="fimg" />
                        <span class="fname">
                            {{name}}
                        </span>
                    </li>
                </ul>`
});