import * as i from './ihc-interfaces'

declare var Vue: any;

export const factionsQuery = "factions(real: true){id,name,img}",
    rolesQuery = "roles(real: true){id,name,img}";

const heroesRequest = "heroes(take:{take},skip:{skip},factions:[{factions}],roles:[{roles}],stars:[{stars}],orderBy:[\"stars:desc\",\"faction\",\"name\"],upgrade:true){name,img,stars}",
    heroFields = "name,img,url,stars,minSpirit,maxSpirit,minGold,maxGold,minStones,maxStones,fodder{{heroFields}}",
    heroArgs = "hero(name:\"{name}\",stars:{stars}){{heroFields}}";

let heroesVue: i.ihcHeroListObject;

function api_base(query: string, variables: i.ihcApiVariables): Promise<any> {
    //console.log("api:", query);
    return fetch("/api", {
            body: JSON.stringify({
                query: query,
                variables: JSON.stringify(variables)
            }),
            method: "POST",
            headers: { "Content-type": "application/json" }
        })
        .then(response => response.json())
        .catch(reason => console.table(reason.errors));
}

export function api(query: string, cache: boolean = false): Promise<any> {
    let cacheDate = 0, data: i.ihcApiCacheable;
    if (cache) {
        data = JSON.parse(localStorage.getItem(query) || "{}");
        if (data)
            cacheDate = data.cacheDate;
    }
    return api_base(query, { cacheDate })
        .then(response => {
            let d: i.ihcApiCacheable;
            if (response && (d = response.data)) {
                //console.log("api:", d);
                d.cacheDate = utc();
                localStorage.setItem(query, JSON.stringify(d));
                return d;
            }
            return data;
        });
}

export function apiToVue(query: string, element: HTMLElement, methods: any = null, cache: boolean = false): Promise<any> {
    return api(query, cache)
        .then(x => {
            return new Vue({
                el: element,
                data: x,
                methods: methods
            });
        });
}

export function heroesQuery(skip: number = 0, take: number = 30, factions: number[] = [], roles: number[] = [], stars: number[] = []): string {
    return heroesRequest
        .replace("{take}", take.toString())
        .replace("{skip}", skip.toString())
        .replace("{factions}", factions.join(","))
        .replace("{roles}", roles.join(","))
        .replace("{stars}", stars.join(","));
}

export function heroQuery(name: string, stars: number, depth: number = 6): string {
    let result = heroArgs.replace("{heroFields}", heroFields);
    for (let i = 0; i < depth; i++) {
        result = result.replace("{heroFields}", heroFields);
    }

    return result.replace(",fodder{{heroFields}}", "")
        .replace("{name}", name)
        .replace("{stars}", stars.toString());
}

export function heroVue(el: HTMLElement, name: string, stars: number, depth: number = 6): Promise<any> {
    return apiToVue(heroQuery(name, stars, depth), el, {
        
    }, false);
}

function utc(date: Date = new Date()): number {
    return (date.getTime() + date.getTimezoneOffset() * 60 * 1000);
}