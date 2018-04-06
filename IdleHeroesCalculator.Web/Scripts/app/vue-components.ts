///<reference path="../shims/vue-shim.d.ts" />
import filterItems from './vue/filterItems.vue'
import heroItem from './vue/heroItem.vue'
import aggList from './vue/aggList.vue'
import fodderList from './vue/fodderList.vue'
import fusionPanel from './vue/fusionPanel.vue'

declare var Vue: any;

Vue.component("hero-item", heroItem);

Vue.component("filter-items", filterItems);

Vue.component("agg-list", aggList);

Vue.component("fodder-list", fodderList);

Vue.component("fusion-panel", fusionPanel);
