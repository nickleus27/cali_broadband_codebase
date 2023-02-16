export interface GraphOptions {
    comparison: boolean,
    rounds:string[],
    graphs:string[],
    roundSelected?: string,
    graphSelected: string,
    graph1:{
        carriers?: string[],
        phone_models?: string[],
        servers?: string[],
        carrierSelected?: string,
        phoneSelected?: string,
        serverSelected?: string
    },
    graph2:{
        carriers?: string[],
        phone_models?: string[],
        servers?: string[],
        carrierSelected?: string,
        phoneSelected?: string,
        serverSelected?: string
    },
    graph3:{
        carriers?: string[],
        phone_models?: string[],
        servers?: string[],
        carrierSelected?: string,
        phoneSelected?: string,
        serverSelected?: string
    }
}