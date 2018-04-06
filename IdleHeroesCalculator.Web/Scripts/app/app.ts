import * as ihc from './ihc'
import * as i from './ihc-interfaces'


declare var Vue: any;

let panelElement = document.getElementById("hero-panel"),
    heroesElement = document.getElementById("heroes"),
    calcElement = document.getElementById("calc"),
    appName = "Idle Heroes Calculator",
    defaultTitle = `Fusion - ${appName}`,
    defaultUrl = "fusion",
    ownedStorageKey = "owned",
    stickyHideElements = document.getElementsByClassName("stickyHide"),
    storedHeroes = <i.ihcHeroBase[]>JSON.parse(localStorage.getItem(ownedStorageKey) || "[]"),
    heroPage = 0,
    fodderPage = 0, fodderPageSize = 50,
    allowScrollLoad = false,
    mdWidth = 768, lgWidth = 1280,
    panelVue: i.ihcPanel,
    heroesVue: i.ihcHeroListObject,
    panelVueMethods = {
        filter: function (event: any) {
            heroPage = 0;
            scrollToTop();
            allowScrollLoad = false;

            let checkbox: HTMLInputElement = event.currentTarget.getElementsByTagName("input")[0];
            checkbox.checked = !checkbox.checked;
            renderHeroes(false);
        },
        heroChange: function (hero: i.ihcHeroDetail) {
            if (hero.owned) {
                removeHero(hero);
            } else {
                addHero(hero);
            }
            sortFodder();
            repopulateDisplayFodder();
            calculateCosts();
        },
        formatNumber: function (num: number, digits: number): string {
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
    },
    heroesVueMethods = {
        heroClick: function (hero: i.ihcHeroDetail) {
            scrollToTop();
            loadSelectedHero(hero.name, hero.stars, true);
        },
        clearSelected: function (event: any) {
            heroesVue.selectedHero = null;
            heroesVue.showList = true;
            heroesVue.showCalc = false;
            heroesVue.fodder = [];
            panelVue.displayFodder = [];
            panelVue.showFilter = true;
            setHeroScrollEvent();
            setLocation(defaultTitle, defaultUrl);
        },
        formatNumber: function (num: number, digits: number): string {
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
    };

window.addEventListener("scroll", globalScrollEvent);

if (panelElement) {
    panelVue = getPanelVue(panelElement);
    renderFilters();
}

if (heroesElement) {
    let selectedHero = window.location.href.split("#")[1];
    heroesVue = getHeroesVue(heroesElement);

    renderHeroes().then(x => {
        if (selectedHero) {
            let selectedSplit = selectedHero.split("-");
            loadSelectedHero(selectedSplit[0].replace("_", " "), parseInt(selectedSplit[1]), true);
        }
    })
}

//triggers a calculation for a selected hero
function loadSelectedHero(name: string, stars: number, setUrl: boolean = false): void {
    setFodderScrollEvent();
    if (setUrl) {
        setLocation(`${name} ${stars}* Fusion - ${appName}`, `fusion#${ihc.identifier(name, stars)}`);
    }
    fodderPage = 0;
    heroesVue.fodder = [];
    //panelVue.displayFodder = [];
    scrollToTop();
    heroesVue.showList = false;

    ihc.api(`{${ihc.heroQuery(name, stars, 7)}}`)
        .then(data => {
            let hero = <i.ihcHeroDetail>data.hero;
            hero.owned = false;
            hero.fromFirst = true;
            heroesVue.selectedHero = hero;//joinHeroes(hero);
            
            addHeroChildren(hero);
            sortFodder();
            populateDisplayFodder(fodderPage, fodderPageSize);
            calculateCosts();

            panelVue.showFilter = false;
            heroesVue.showCalc = true;
        });
}

//recursively add hero's children
function addHeroChildren(hero: i.ihcHeroDetail, depth: number = 0): void {
    if (!hero) {
        return;
    }
    
    if (typeof hero.id === "undefined") {
        hero.id = nextId();
    }

    if (typeof hero.depth === "undefined") {
        hero.depth = depth;
    }

    if (hero.fodder && hero.fodder.length) {
        heroesVue.fodder = heroesVue.fodder.concat(hero.fodder);

        hero.fodder.forEach((h, i) => {
            if (typeof h.fromFirst === "undefined") {
                h.fromFirst = i === 0 && hero.fromFirst;
            }

            addHeroChildren(h, depth + 1);
        });
    }
}

//add a hero and its children to the fodder list
function addHero(hero: i.ihcHeroDetail) {
    heroesVue.fodder.push(hero);
    addHeroChildren(hero);
}

//recursively remove hero's children
function removeHero(hero: i.ihcHeroDetail, list: i.ihcHeroDetail[] = []): void {
    if (hero && hero.fodder) {
        let first = false;
        if (!list.length) {
            list = heroesVue.fodder.slice();
            first = true;
        }

        hero.fodder.forEach(f => {
            let idx = list.indexOf(f);
            if (idx > -1) {
                list.splice(idx, 1);
            }

            removeHero(f, list);
        });

        if (first) {
            heroesVue.fodder = list;
        }
    }
}

//Determine the spirit/gold/stones cost for all current fodder
function calculateCosts(): void {
    if (heroesVue.selectedHero) {
        var spirit = heroesVue.selectedHero.maxSpirit,
            gold = heroesVue.selectedHero.maxGold,
            stones = heroesVue.selectedHero.maxStones,
            aggregate: any = {},
            aggregates: i.ihcHeroDetail[] = [];

        heroesVue.fodder.forEach(x => {
            if (x.owned) return;

            let heroId = ihc.heroIdentifier(x);

            if (!aggregate[heroId]) {
                aggregate[heroId] = JSON.parse(JSON.stringify(x));
                aggregate[heroId].count = 0;
            }

            aggregate[heroId].count++;

            if (x.fromFirst) {
                spirit += x.maxSpirit;
                gold += x.maxGold;
                stones += x.maxStones;
            } else {
                spirit += x.minSpirit;
                gold += x.minGold;
                stones += x.minStones;
            }
        });

        for (var agg in aggregate) {
            aggregates.push(aggregate[agg]);
        }

        heroesVue.aggregates = aggregates.sort(heroSort);
        heroesVue.spirit = spirit;
        heroesVue.gold =  gold;
        heroesVue.stones = stones;
    } else {
        heroesVue.spirit = heroesVue.gold = heroesVue.stones = 0;
        heroesVue.aggregates = [];
        panelVue.showFilter = true;
        heroesVue.showList = true;
        heroesVue.showCalc = false;
    }
}

//Sort fodder list
function sortFodder(): void {
    heroesVue.fodder = heroesVue.fodder.sort(heroSort);
}

//Method to pass into the .sort for fodder array
function heroSort(a: i.ihcHeroDetail, b: i.ihcHeroDetail): number {
    if (a.depth < b.depth) {
        return -1;
    }

    if (a.depth > b.depth) {
        return 1;
    }

    return b.stars - a.stars;
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
    setHeroScrollEvent();

    var filter = getFilter(),
        pageSize = getWindowPageSize();

    return ihc.api(`{${ihc.heroesQuery(heroPage * pageSize, pageSize, filter.f, filter.r, filter.s)}}`)
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
            panelVue.factions = x.factions;
            panelVue.roles = x.roles;
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
function shouldScrollLoad(currentPage: number): boolean {
    var scrollLoadHeight = getScrollLoadHeight(currentPage),
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
        showList: true,
        showCalc: false,
        fodder: [],
        spirit: 0,
        gold: 0,
        stones: 0,
        aggregates: [],
        //displayFodder: []
    }

    return new Vue({
        el: element,
        data: result,
        methods: heroesVueMethods
    })
}

//gets the base level panelVue object
function getPanelVue(element: HTMLElement): i.ihcPanel {
    let result: i.ihcPanel = {
        roles: [],
        factions: [],
        cacheDate: 0,
        showFilter: true,
        displayFodder: [],
        //spirit: 0,
        //gold: 0,
        //stones: 0,
        //aggregates: []
    }

    return new Vue({
        el: element,
        data: result,
        methods: panelVueMethods
    });
}

//populate the object that displays the fodder
function populateDisplayFodder(start: number, end: number): void {
    panelVue.displayFodder = panelVue.displayFodder.concat(heroesVue.fodder.slice(start, end));
}

//repopulate display list after fodder list is changed
function repopulateDisplayFodder(): void {
    let displayLength = panelVue.displayFodder.length;
    panelVue.displayFodder = heroesVue.fodder.splice(0, Math.min(displayLength, heroesVue.fodder.length));
}

function globalScrollEvent(): void {

    for (var i = 0; i < stickyHideElements.length; i++) {
        var el = <HTMLElement>stickyHideElements[i];

        if (el.getBoundingClientRect().top < window.scrollY) {
            el.style.display = "none";
        } else {
            el.style.display = "initial";
        }
    }
}

//event handler for window scroll when full hero list is displayed
function heroListWindowScrollEvent(): void {
    if (shouldScrollLoad(heroPage)) {
        heroPage++;
        renderHeroes();
    }
}

//event handler for window scroll when fodder is displayed
function heroFodderWindowScrollEvent(): void {
    if (shouldScrollLoad(fodderPage)) {
        fodderPage++;

        let start = fodderPage * fodderPageSize;
        populateDisplayFodder(start, start + fodderPageSize);
    }
}

//set up window scroll events for when hero list is displayed
function setHeroScrollEvent(): void {
    window.removeEventListener("scroll", heroFodderWindowScrollEvent);
    window.addEventListener("scroll", heroListWindowScrollEvent);
}

//set up window scroll events for when fodder is displayed
function setFodderScrollEvent(): void {
    window.removeEventListener("scroll", heroListWindowScrollEvent);
    window.addEventListener("scroll", heroFodderWindowScrollEvent);
}

//scrolls the window to the top of the page
function scrollToTop(): void {
    window.scrollTo(0, 0);
}

//get an id
let nextId = (function () {
    var i = 0;

    return function (): number {
        return i++;
    }
}())