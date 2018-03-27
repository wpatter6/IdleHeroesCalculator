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
    calcVue: any,
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
            calculateForHero(selectedSplit[0].replace("_", " "), parseInt(selectedSplit[1]));
        }
    })
}

//triggers a calculation for a selected hero
function calculateForHero(name: string, stars: number, setUrl: boolean = false, isNotFirst: boolean = false, parentId: string = "", fromFirst: boolean = true): Promise<any> {
    if (setUrl) {
        setLocation(`${name} ${stars}* Fusion - ${appName}`, `fusion#${name.replace(" ", "_")}-${stars}`);
    }
    window.removeEventListener("scroll", windowScrollEvent);

    return ihc.api(`{${ihc.heroQuery(name, stars, 1)}}`, true)
        .then(data => {
            let hero = <i.ihcHeroDetail>data.hero,
                theHero: i.ihcHeroDetail | null = null;

            if (!hero) return;

            hero.owned = false;

            if (!isNotFirst) {
                heroesVue.selectedHero = hero;//joinHeroes(hero);
                heroesVue.selectedHero.id = parentId = nextId();
                heroesVue.heroSelected = true;
                heroesVue.spirit = heroesVue.selectedHero.maxSpirit;
                heroesVue.gold = heroesVue.selectedHero.maxGold;
                heroesVue.stones = heroesVue.selectedHero.maxStones;
            } else {
                theHero = heroesVue.fodder.filter(x => x.id === parentId)[0];
                theHero.fodder = [];
            }

            if (hero.fodder && hero.fodder.length) {
                for (let i = 0; i < hero.fodder.length; i++) {
                    var f = hero.fodder[i];

                    heroesVue.fodder.push(f);

                    f.id = nextId();
                    f.parentId = parentId;

                    if (fromFirst && i === 0) {
                        f.fromFirst = true;
                        heroesVue.spirit += f.maxSpirit;
                        heroesVue.gold += f.maxGold;
                        heroesVue.stones += f.maxStones;
                    } else {
                        f.fromFirst = false;
                        heroesVue.spirit += f.minSpirit;
                        heroesVue.gold += f.minGold;
                        heroesVue.stones += f.minStones;
                    }

                    if (theHero) {
                        theHero.fodder.push(f);
                    }

                    calculateForHero(f.name, f.stars, false, true, f.id, f.fromFirst);
                }
            }
        });
}

//recursively remove hero's children
function removeHeroChildren(hero: i.ihcHeroDetail) {
    if (!hero.fodder) return;
    hero.fodder.forEach(x => {
        removeHeroChildren(x);
        var idx = heroesVue.fodder.map(y => y.id).indexOf(x.id);
        heroesVue.fodder.splice(idx, 1);
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
                    calculateForHero(hero.name, hero.stars, false, true, hero.id, hero.fromFirst);
                }
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