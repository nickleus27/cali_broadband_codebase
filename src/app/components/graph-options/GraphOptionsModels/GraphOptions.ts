export interface GraphOptions {
    graphType: string,
    roundSelected?: string,
    carrierSelected?: string,
    phoneSelected?: string,
    countySelected?: string,
    testSelected?: string,
    carriers: string[],
    phoneModels?: string[],
    rounds?: string[],
    counties?: string[],
    tests?: string[]
}