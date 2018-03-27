import * as ihc from './ihc'
import * as i from './ihc-interfaces'

let filterElement = document.getElementById("filters"),
    heroesElement = document.getElementById("heroes"),
    calcElement = document.getElementById("calc"),
    appName = "Idle Heroes Calculator",
    defaultTitle = `Fusion - ${appName}`,
    defaultUrl = "fusion",
    ownedStorageKey = "owned",
    storedHeroes = <i.ihcHeroBase[]>JSON.parse(localStorage.getItem(ownedStorageKey) || "[]"),
    filterVue = {},
    heroesVue: i.ihcHeroListObject,
    page = 0, allowScrollLoad = false,
    mdWidth = 768, lgWidth = 1280;

if (filterElement) {
    renderFilters();
}

if (heroesElement) {
    let selectedHero = window.location.href.split("#")[1];
    heroesVue = getHeroesVue(heroesElement);

    renderHeroes().then(x => {
        if (selectedHero) {
            let selectedSplit = selectedHero.split("-");
            calculateForHero(selectedSplit[0].replace("_", " "), parseInt(selectedSplit[1]), true);
        }
    })
}

//triggers a calculation for a selected hero
function calculateForHero(name: string, stars: number, setUrl: boolean = false) {
    if (setUrl) {
        setLocation(`${name} ${stars}* Fusion - ${appName}`, `fusion#${name.replace(" ", "_")}-${stars}`);
    }
    window.removeEventListener("scroll", windowScrollEvent);

    return ihc.api(`{${ihc.heroQuery(name, stars, 7)}}`, true)
        .then(data => {
            let hero = <i.ihcHeroDetail>data.hero;
            hero.owned = false;
            
            heroesVue.selectedHero = hero;//joinHeroes(hero);
            heroesVue.selectedHero.id = nextId();
            heroesVue.heroSelected = true;

            addHeroChildren(hero);
            calculateCosts();
        });
}

function addHeroChildren(hero: i.ihcHeroDetail) {
    if (hero && hero.fodder) {
        hero.fodder.forEach((h, i) => {
            heroesVue.fodder.push(h);
        });

        hero.fodder.forEach((h, i) => {
            h.id = h.id || nextId();
            h.parentId = hero.id;
            h.fromFirst = i === 0 && hero.fromFirst;

            addHeroChildren(h);
        });
    }
}

//recursively remove hero's children
function removeHeroChildren(hero: i.ihcHeroDetail) {
    if (hero && hero.fodder) {
        hero.fodder.forEach(f => {
            removeHeroChildren(f);

            var idx = heroesVue.fodder.map(y => y.id).indexOf(f.id);
            heroesVue.fodder.splice(idx, 1);
        });
    }
}

//Determine the spirit/gold/stones cost for all current fodder
function calculateCosts() {
    if (heroesVue.selectedHero) {
        heroesVue.spirit = heroesVue.selectedHero.maxSpirit + heroesVue.fodder.map(x => x.fromFirst ? x.maxSpirit : x.minSpirit).reduce((accumulator, currentValue) => accumulator + currentValue);
        heroesVue.gold = heroesVue.selectedHero.maxGold + heroesVue.fodder.map(x => x.fromFirst ? x.maxGold : x.minGold).reduce((accumulator, currentValue) => accumulator + currentValue);
        heroesVue.stones = heroesVue.selectedHero.maxStones + heroesVue.fodder.map(x => x.fromFirst ? x.maxStones : x.minStones).reduce((accumulator, currentValue) => accumulator + currentValue);
    } else {
        heroesVue.spirit = heroesVue.gold = heroesVue.stones = 0;
    }
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

//gets heroes object from API using the current filter
function renderHeroes(append: boolean = true): Promise<any> {
    window.addEventListener("scroll", windowScrollEvent);

    var filter = getFilter(),
        pageSize = getWindowPageSize();

    return ihc.api(`{${ihc.heroesQuery(page * pageSize, pageSize, filter.f, filter.r, filter.s)}}`)
        .then(data => {
            if (append) {
                heroesVue.heroes = heroesVue.heroes.concat(data.heroes);
            } else {
                heroesVue.heroes = data.heroes;
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

//sets the page url and title
function setLocation(title: string, url: string, replace: boolean = false) {
    if (replace)
        history.replaceState(undefined, title, url);
    else
        history.pushState(undefined, title, url);

    window.document.title = title;
}

//gets the base level heroesVue object
function getHeroesVue(element: HTMLElement): i.ihcHeroListObject {
    let result: i.ihcHeroListObject = {
        heroes: [],
        selectedHero: null,
        heroSelected: false,
        fodder: [],
        stones: 0,
        gold: 0,
        spirit: 0
    }

    return new Vue({
        el: element,
        data: result,
        methods: {
            heroClick: function (event: any) {
                console.log("heroClick", event.currentTarget.id);
                var sp = event.currentTarget.id.split("-");
                calculateForHero(sp[0], parseInt(sp[1]), true);
            },
            clearSelected: function (event: any) {
                heroesVue.selectedHero = null;
                heroesVue.heroSelected = false;
                heroesVue.fodder = [];
                setLocation(defaultTitle, defaultUrl);
            },
            heroChange: function (hero: i.ihcHeroDetail) {
                if (hero.owned) {
                    removeHeroChildren(hero);
                } else {
                    addHeroChildren(hero);
                }
                calculateCosts();
            },
            formatNumber: function (num: number, digits: number) {
                var si = [
                    { value: 1, symbol: "" },
                    { value: 1E3, symbol: "k" },
                    { value: 1E6, symbol: "M" },
                    { value: 1E9, symbol: "G" },
                    { value: 1E12, symbol: "T" },
                    { value: 1E15, symbol: "P" },
                    { value: 1E18, symbol: "E" }
                ];
                var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
                var i;
                for (i = si.length - 1; i > 0; i--) {
                    if (num >= si[i].value) {
                        break;
                    }
                }
                return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
            }
        }
    })
}

//event handler for window scroll
function windowScrollEvent() {
    if (shouldScrollLoad()) {
        page++;
        renderHeroes();
    }
}

//get a randomized id
let nextId = (function () {
    var nextIndex = [0, 0, 0];
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var num = chars.length;

    return function (): string {
        var a = nextIndex[0];
        var b = nextIndex[1];
        var c = nextIndex[2];
        var id = chars[a] + chars[b] + chars[c];

        a = ++a % num;

        if (!a) {
            b = ++b % num;

            if (!b) {
                c = ++c % num;
            }
        }
        nextIndex = [a, b, c];
        return id;
    }
}())

//array function to remove element matching a callback result without changing original array
let removeIf = function<T> (array: Array<T>, callback: (n: T, i: number) => any) : T[] {
    let i = 0, arr = array.slice();
    while (i < arr.length) {
        if (callback(array[i], i)) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }

    return arr;
};