import * as ihc from './ihc'
import * as i from './ihc-interfaces'

let filterElement = document.getElementById("filters"),
    heroesElement = document.getElementById("heroes"),
    filterVue = {}, heroesVue: i.ihcHeroListObject,
    page = 0, heroesList: i.ihcHeroBase[] = [], allowScrollLoad = false,
    mdWidth = 768, lgWidth = 1280;

if (filterElement) {
    getFilters();
}

if (heroesElement) {
    getHeroes();

    window.addEventListener("scroll", function () {
        if (shouldScrollLoad()) {
            page++;
            getHeroes();
        }
    });
}

//determine if the current scrolling should trigger a page load
function shouldScrollLoad(): boolean {
    var scrollLoadHeight = getScrollLoadHeight(page),
        scrollRatio = window.scrollY / document.body.clientHeight;

    return allowScrollLoad && scrollRatio > scrollLoadHeight;
}

//get the current scroll distance that should trigger a page load
function getScrollLoadHeight(i: number): number {
    var add = (screen.width / screen.height) > 1 ? .1 : -.2;
    return (i + 1) / (i + 3) + add;
}

//gets the hero page size for scrolling based on window width and aspect ratio
function getWindowPageSize(): number {
    let clientWidth = screen.width, maxImgWidth = 210,
        rows = 10, cols = 3;

    if (clientWidth >= lgWidth) {
        cols = 5 + Math.floor((clientWidth - 1390) / maxImgWidth)
    } else if (clientWidth >= mdWidth) {
        cols = 4;
    }

    return cols * rows;
}

//gets hero object from API using the current filter
function getHeroes(append: boolean = true): void {
    var filter = getFilter(),
        pageSize = getWindowPageSize();

    ihc.api(`{${ihc.heroes(page * pageSize, pageSize, filter.f, filter.r, filter.s)}}`)
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
            allowScrollLoad = x.heroes.length > 0;
        });
}

//gets filter object from API
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
                        allowScrollLoad = false;

                        let checkbox: HTMLInputElement = event.currentTarget.getElementsByTagName("input")[0];
                        checkbox.checked = !checkbox.checked;
                        getHeroes(false);
                    }
                }
            });
        });
}

//gets the current filter off of the page
function getFilter(): i.ihcHeroFilterObject {
    let result: any = { f: [], r: [], s:[] };

    let checkboxes = document.getElementsByClassName("fcheck");
    for (var i = 0; i < checkboxes.length; i++) {
        let checkbox = <HTMLInputElement>checkboxes[i];
        if (!checkbox.checked) continue;

        var sp = checkbox.id.split("-");
        result[sp[0]].push(parseInt(sp[1]));
    }
    return result;
}
