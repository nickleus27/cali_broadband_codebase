/**
 * This object holds phone models for using the line graph
 * which has no specific round to draw from since each round
 * is used for points on the graph.
 */
interface LineGraphOptions {
    carriers: { [key: string]: any; },
    tests: string[],
}

const lineGraphOptions: LineGraphOptions = {
    carriers:
    {
        'AT&T': ['SM-S901U', 'SM-G998U', 'SM-G970U'],
        'FirstNet': ['XP8800', 'SM-G998U'],
        'Sprint': ['SM-G973U'],
        'T-Mobile': ['SM-S901U', 'SM-G998U', 'SM-G970U'],
        'Verizon': ['SM-S901U', 'SM-G998U', 'SM-G970U']
    },
    /**
     * TODO: need to correctly label these Mbps or mbps
     */
    tests: ["N/A", "0M-10M", "10M-50M", "50M-100M", "100M-200M", "200M+"]
}

export { LineGraphOptions, lineGraphOptions };