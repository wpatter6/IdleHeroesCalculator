export interface ihcApiVariables {
    cacheDate: number
}
export interface ihcApiRole {
    id: number,
    name: string,
    img: string
}
export interface ihcApiFaction {
    id: number,
    name: string,
    img: string
}
export interface ihcHeroFilterObject {
    f: number[],
    r: number[],
    s: number[]
}

export interface ihcHeroBase {
    name: string,
    stars: number
}
export interface ihcHeroImg extends ihcHeroBase {
    img: string
}
export interface ihcHeroDetail extends ihcHeroImg {
    id: number | undefined,
    minSpirit: number,
    maxSpirit: number,
    minGold: number,
    maxGold: number,
    minStones: number,
    maxStones: number,
    fodder: ihcHeroDetail[],
    owned: boolean,
    needed: boolean,
    fromFirst: boolean | undefined,
    count: number,
    showCount: boolean,
    depth: number
}

export interface ihcApiCacheable {
    roles: ihcApiRole[],
    factions: ihcApiFaction[],
    cacheDate: number
}
export interface ihcPanel extends ihcApiCacheable {
    showFilter: boolean,
    displayFodder: ihcHeroDetail[]/*,
    fodder: ihcHeroDetail[],
    spirit: number,
    gold: number,
    stones: number,
    aggregates: ihcHeroDetail[]*/
}
export interface ihcHeroListObject {
    heroes: ihcHeroImg[],
    selectedHero: ihcHeroDetail | null,
    showList: boolean,
    showCalc: boolean,
    fodder: ihcHeroDetail[],
    //displayFodder: ihcHeroDetail[],
    spirit: number,
    gold: number,
    stones: number,
    aggregates: ihcHeroDetail[]
}