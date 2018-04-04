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
                    <filter-item v-for="s in maxStars - minStars + 1" :name="maxStars - s + 1 + ' star'" :id="'s-' + (maxStars - s + 1)" :key="'star-' + (maxStars - s + 1)" @click.native="filter"></filter-item>
                </ul>`});

Vue.component("hero-item", {
    props: ["hero", "showCount"],
    template:   `<span :class="'hero s' + hero.stars"  :id="hero.name + '-' + hero.stars">
                    <img :src="hero.img" class="himg" />
                    <span v-if="hero.count > 0" class="hcount">{{hero.count}}</span>
                    <span v-if="hero.stars && hero.stars > 5 && hero.stars < 10" class="stars">
                        <img v-for="s in hero.stars - 5" src= "/img/redstar.png" class="star h9" />
                    </span>
                    <span v-else-if="hero.stars && hero.stars < 6" class="stars">
                        <img v-for="s in hero.stars" src= "/img/yellowstar.png" class="star h5" />
                    </span>
                </span>`});

Vue.component("calc-item", {
    props: ["hero", "fodder", "change"],
    template:   `<span>
                    <hero-item :hero="hero" :id="hero.id" class="cursor-default"></hero-item>
                    <div class="stickyHeader"><h2>Select owned<span class="hidden-sm"> heroes</span></h2></div>
                    <span v-if="fodder && fodder.length" class="fodder">
                        <label v-for="f in fodder" :id="f.id" class="citem">
                            <hero-item :showCount="0" :hero="f"></hero-item>
                            <input type="checkbox" v-model="f.owned" v-on:change="change(f)" />
                            <span class="checkmark shade"><i class="icon-ok"></i></span>
                        </label>
                    </span>
                </span>`});

//Vue.component("calc-item", {
//    props: ["hero", "heroClick", "first"],
//    template:   `<span>
//                    <label v-if="!first && hero != null" :id="'c-' + hero.name + '-' + hero.stars" class="citem">
//                        <hero-item :hero="hero" @click.native="heroClick"></hero-item>
//                        <input type="checkbox" v-model="hero.owned" />
//                        <span class="checkmark shade"><i class="icon-ok"></i></span>
//                    </label>
//                    <hero-item v-if="first" :hero="hero" @click.native="heroClick"></hero-item>
//                    <span v-if="hero.fodder && hero.fodder.length" class="fodder">
//                        <calc-item v-for="f in hero.fodder" :hero="f" :first="false"></calc-item>
//                    </span>
//                </span>`});