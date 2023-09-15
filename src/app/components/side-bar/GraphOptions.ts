export interface GraphOptions {
    comparison: boolean,
    rounds: string[],
    graphs: string[],
    counties: string[],
    graphSelected: string,
    testSelected?: any,
    graphType?: string,
    graph1: {
        roundSelected?: string,
        carriers?: string[],
        phone_models?: string[],
        carrierSelected?: string,
        phoneSelected?: string,
        countySelected?: string,
    },
    graph2: {
        roundSelected?: string,
        carriers?: string[],
        phone_models?: string[],
        carrierSelected?: string,
        phoneSelected?: string,
        countySelected?: string,
    },
    graph3: {
        roundSelected?: string,
        carriers?: string[],
        phone_models?: string[],
        carrierSelected?: string,
        phoneSelected?: string,
        countySelected?: string,
    }
}