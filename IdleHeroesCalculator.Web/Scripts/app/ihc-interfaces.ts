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
    id: number,
    name: string,
    img: string
}
export interface ihcHeroListObject {
    heroes: ihcHeroBase[]
}
export interface ihcHeroFilterObject {
    f: number[],
    r: number[]
}