import * as i from './ihc-interfaces'

declare var Vue: any;

export const factions = "factions(real: true){id,name,img}",
    roles = "roles(real: true){id,name,img}";

const heroesRequest = "heroes(take:{t},skip:{s},factions:[{f}],roles:[{r}],orderBy:[\"stars:desc\",\"faction\",\"name\"]){name,img}";

function api_base(query: string, variables: i.ihcApiVariables): Promise<any> {
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
                d.cacheDate = utc();
                localStorage.setItem(query, JSON.stringify(d));
                return d;
            }
            return data;
        });
}
export function apiToVue(query: string, element: HTMLElement, cache: boolean = false): Promise<any> {
    return api(query, cache)
        .then(x => {
            return new Vue({
                el: element,
                data: x
            });
        });
}


export function utc(date: Date = new Date()): number {
    return (date.getTime() + date.getTimezoneOffset() * 60 * 1000);
}
export function heroes(factions: number[] = [], roles: number[] = [], skip: number = 0, take: number = 30): string {
    return heroesRequest
        .replace("{t}", take.toString())
        .replace("{s}", skip.toString())
        .replace("{f}", factions.join(","))
        .replace("{r}", roles.join(","));
}