import * as ihc from './ihc'

let filterElement = document.getElementById("filters");
let filterVue: any = {};
if (filterElement) {
    ihc.api(`{${ihc.factions},${ihc.roles}}`, true)
        .then(x => {
            filterVue = new Vue({
                el: filterElement,
                data: x,
                methods: {
                    filter: function (event: any) {
                        console.log("clickevent", event);
                        console.log("clicked ID", event.currentTarget);
                    }
                }
            })
        });
}

let heroesElement = document.getElementById("heroes");
let heroesVue: any = {};
if (heroesElement) {
    ihc.api(`{${ihc.heroes()}}`)
        .then(x => {
            heroesVue = new Vue({
                el: heroesElement,
                data: x,
                methods: {
                
                }
            });
        });
}

