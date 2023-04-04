export interface GraphOptions {
    comparison: boolean,
    rounds: string[],
    graphs: string[],
    graphSelected: string,
    testSelected?: any,
    isBarGraph?: boolean,
    graph1: {
        roundSelected?: string,
        carriers?: string[],
        phone_models?: string[],
        carrierSelected?: string,
        phoneSelected?: string,
    },
    graph2: {
        roundSelected?: string,
        carriers?: string[],
        phone_models?: string[],
        carrierSelected?: string,
        phoneSelected?: string,
    },
    graph3: {
        roundSelected?: string,
        carriers?: string[],
        phone_models?: string[],
        carrierSelected?: string,
        phoneSelected?: string,
    }
}