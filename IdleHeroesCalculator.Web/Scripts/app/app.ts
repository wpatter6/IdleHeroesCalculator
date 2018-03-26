import * as ihc from './ihc'
import * as i from './ihc-interfaces'

let filterElement = document.getElementById("filters"),
    heroesElement = document.getElementById("heroes"),
    calcElement = document.getElementById("calc"),
    ownedStorageKey = "owned",
    storedHeroes = <i.ihcHeroBase[]>JSON.parse(localStorage.getItem(ownedStorageKey) || "[]"),
    filterVue = {},
    heroesVue: i.ihcHeroListObject,
    calcVue: any,
    page = 0, allowScrollLoad = false,
    mdWidth = 768, lgWidth = 1280;

if (heroesElement) {
    renderHeroes();

    window.addEventListener("scroll", function () {
        if (shouldScrollLoad()) {
            page++;
            renderHeroes();
        }
    });
}

if (filterElement) {
    renderFilters();
}

function calculateForHero(name: string, stars: number) {
    ihc.api(`{${ihc.heroQuery(name, stars, 1)}}`)
        .then(data => {
            data.owned = false;
            heroesVue.selectedHero = joinHeroes(<i.ihcHeroDetail>data.hero);
            heroesVue.heroSelected = true;
        });
}

//connects heroes to their ancestors and sets their owned status based on local storage
function joinHeroes(data: i.ihcHeroDetail, needed: boolean = true): i.ihcHeroDetail {
    data.owned = storedHeroes.some(x => x.name == data.name && x.stars == data.stars);
    data.needed = needed && !data.owned;
    if (data.fodder) {
        data.fodder.forEach(f => joinHeroes(f, data.needed));
    } else {
        data.fodder = [];
    }
    return data;
}

//stores a checked hero in local storage
function storeCheckedHero(name: string, stars: number, remove: boolean = false) {
    if (!remove) {
        storedHeroes.push({ name, stars });
    } else {
        storedHeroes = storedHeroes.filter(x => !(x.name === name && x.stars === stars));
    }
    localStorage.setItem(ownedStorageKey, JSON.stringify(storedHeroes));
}

//gets hero object from API using the current filter
function renderHeroes(append: boolean = true): void {
    var filter = getFilter(),
        pageSize = getWindowPageSize();

    ihc.api(`{${ihc.heroesQuery(page * pageSize, pageSize, filter.f, filter.r, filter.s)}}`)
        .then(data => {
            data.selectedHero = null;
            data.heroSelected = false;
            if (heroesVue) {
                if (append) {
                    heroesVue.heroes = heroesVue.heroes.concat(data.heroes);
                } else {
                    heroesVue.heroes = data.heroes;
                }
            } else {
                heroesVue = new Vue({
                    el: heroesElement,
                    data: data,
                    methods: {
                        heroClick: function (event: any) {
                            console.log("heroClick", event.currentTarget.id);
                            var sp = event.currentTarget.id.split("-");
                            calculateForHero(sp[0], parseInt(sp[1]));
                        },
                        clearSelected: function (event: any) {
                            heroesVue.selectedHero = null;
                            heroesVue.heroSelected = false;
                        }
                    }
                });
            }
            allowScrollLoad = data.heroes.length > 0;
        });
}

//gets filter object from API
function renderFilters(): void {
    ihc.api(`{${ihc.factionsQuery},${ihc.rolesQuery}}`, true)
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
                        renderHeroes(false);
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