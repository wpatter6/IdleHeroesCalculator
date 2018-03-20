import * as ihc from './ihc'
import * as i from './ihc-interfaces'

let filterElement = document.getElementById("filters"),
    heroesElement = document.getElementById("heroes"),
    filterVue = {}, heroesVue: i.ihcHeroListObject,
    page = 0, pageSize = document.body.clientWidth > 415 ? 40 : 30,
    heroesList: i.ihcHeroBase[] = [], doScrollLoad = false;

if (filterElement) {
    getFilters();
}

if (heroesElement) {
    getHeroes();
}

window.addEventListener("scroll", function () {
    if (shouldScrollLoad()) {
        page++;
        getHeroes();
    }
});

function shouldScrollLoad(): boolean {
    return doScrollLoad && window.scrollY / document.body.clientHeight > getScrollLoadHeight(page);
}

function getScrollLoadHeight(i: number): number {
    return (i + 1) / (i + 3) + .1;
}

function getFilter(): i.ihcHeroFilterObject {
    let result: any = { f: [], r: [] };

    let checkboxes = document.getElementsByClassName("fcheck");
    for (var i = 0; i < checkboxes.length; i++) {
        let checkbox = <HTMLInputElement>checkboxes[i];
        if (!checkbox.checked) continue;

        var sp = checkbox.id.split("-");
        result[sp[0]].push(parseInt(sp[1]));
    }
    return result;
}

function getHeroes(append: boolean = true): void {
    var filter = getFilter();

    ihc.api(`{${ihc.heroes(page * pageSize, pageSize, filter.f, filter.r)}}`)
        .then(x => {
            if (heroesVue) {
                if (append) {
                    heroesVue.heroes = heroesVue.heroes.concat(x.heroes);
                } else {
                    heroesVue.heroes = x.heroes;
                }
            } else {
                heroesVue = new Vue({
                    el: heroesElement,
                    data: x,
                    methods: {
                        //todo hero click
                        heroClick: function (event: any) {
                            console.log("heroClick", event.currentTarget.id);
                        }
                    }
                });
                heroesList = heroesVue.heroes;
            }
            doScrollLoad = true;
        });
}

function getFilters(): void {
    ihc.api(`{${ihc.factions},${ihc.roles}}`, true)
        .then(x => {
            filterVue = new Vue({
                el: filterElement,
                data: x,
                methods: {
                    filter: function (event: any) {
                        page = 0;
                        document.body.scrollTop = document.body.scrollHeight;
                        doScrollLoad = false;

                        let checkbox: HTMLInputElement = event.currentTarget.getElementsByTagName("input")[0];
                        checkbox.checked = !checkbox.checked;
                        getHeroes(false);
                    }
                }
            });
        });
}