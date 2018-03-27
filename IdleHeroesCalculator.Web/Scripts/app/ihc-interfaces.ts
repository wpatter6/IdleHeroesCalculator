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
export interface ihcApiCacheable {
    roles: ihcApiRole,
    factions: ihcApiFaction,
    cacheDate: number
}
export interface ihcHeroBase {
    name: string,
    stars: number
}
export interface ihcHeroImg extends ihcHeroBase {
    img: string
}
export interface ihcHeroListObject {
    heroes: ihcHeroImg[],
    selectedHero: ihcHeroDetail | null,
    heroSelected: boolean,
    fodder: ihcHeroDetail[],
    spirit: number,
    gold: number,
    stones: number
}
export interface ihcHeroDetail extends ihcHeroImg {
    id: string, 
    parentId: string,
    minSpirit: number,
    maxSpirit: number,
    minGold: number,
    maxGold: number,
    minStones: number,
    maxStones: number,
    fodder: ihcHeroDetail[],
    owned: boolean,
    needed: boolean,
    fromFirst: boolean
}
export interface ihcHeroFilterObject {
    f: number[],
    r: number[],
    s: number[]
}