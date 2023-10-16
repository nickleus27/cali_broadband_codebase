import { Injectable } from '@angular/core';
import { GraphOptions } from 'src/app/components/graph-options/GraphOptionsModels/GraphOptions';
import { lineGraphOptions } from 'src/app/components/side-bar/graph-options-models/LineGraphOptions';
import { ComponentDataService } from '../component-data/component-data.service';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  linegraphOptions;

  constructor(private compDataService: ComponentDataService) {
    this.linegraphOptions = lineGraphOptions;
  }

  /**
   * 
   * @param graphChoices 
   * @param roundData 
   * @returns 
   */
  public barGraph(graphChoices: GraphOptions[], roundData: { [key: string]: any }): any {
    var dataSets: any = [];
    const speeds = ["0-10 Mbps", "10-50 Mbps", "50-100 Mbps", "100-200 Mbps", "200+ Mbps"];

    graphChoices.forEach(graph => {
      var dataSeries: number[] = [];
      dataSeries.push(this.getErrors(
        roundData, graph.roundSelected!, graph.carrierSelected!, graph.phoneSelected!
      ));

      dataSeries.push(
        ...this.getSpeeds(
          roundData, graph.roundSelected!, graph.carrierSelected!, graph.phoneSelected!
        )
      );
      dataSets.push(
        {
          data: dataSeries,
          label: `${this.compDataService.getRoundMapValue(graph.roundSelected!)} : ${graph.carrierSelected} ${this.compDataService.getModelMapValue(graph.phoneSelected!)}`
        }
      );
    });


    return {
      labels: ['N/A', ...speeds],
      datasets: dataSets
    };
  }
  /**
   * 
   * @param graphChoices 
   * @param data 
   * @returns 
   */
  public lineGraph(graphChoices: GraphOptions[], data: { [key: string]: any }): any {
    const labels: string[] = [
      "Spring 2021",
      "Fall 2021",
      "Summer 2022"
    ];
    // console.log(data)
    // use speeds to pick correct value from getSpeeds array returned
    const speeds: { [key: string]: number } = { "0-10 Mbps": 0, "10-50 Mbps": 1, "50-100 Mbps": 2, "100-200 Mbps": 3, "200+ Mbps": 4 };
    const rounds: string[] = ['round14', 'round15', 'round16'];
    var dataSets: any = [];
    graphChoices.forEach(graph => {
      var dataSeries: number[] = [];
      rounds.forEach(round => {
        let carrier = graph.carrierSelected!;
        let phone = this.getCurrPhone(carrier, Object.keys(data[round][carrier]))
        let speedRange = graph.speedRangeSelected!;
        if (speedRange === 'N/A') {
          dataSeries.push(
            this.getErrors(data, round, carrier, phone)
          );
        } else {
          // pick just the test speed from getSpeeds array
          dataSeries.push(
            this.getSpeeds(data, round, carrier, phone)[speeds[speedRange!]]
          );
        }
      });
      dataSets.push({
        data: dataSeries,
        label: graph.carrierSelected,
        fill: false,
        tension: 0.5,
        //borderColor: 'black',
        //backgroundColor: 'rgba(255,0,0,0.3)'
      });
    });
    return {
      labels: labels,
      datasets: dataSets
    };
  }

  /**
   * 
   * @param graphOptions 
   * @param roundData 
   * @returns lineChartData
   */
  public countyLineGraph(graphChoices: GraphOptions[], roundData: { [key: string]: any }): any {
    const labels: string[] = [
      "Fall 2017", "Summer 2020", "Spring 2021", "Fall 2021", "Summer 2022", "Spring 2023"
    ];
    const rounds = ['ctyfa2017', 'ctysu2020', 'ctysp2021', 'ctyfa2021', 'ctysu2022', 'ctysp2023'];
    const dataSets: any[] = [];
    graphChoices.forEach(graph => {
      const avgDls: any[] = [];
      rounds.forEach((round, i) => {
        const countyData: any = roundData[round][graph.countySelected!];
        const carrier = graph.carrierSelected!;
        const phone = this.getCurrPhone(carrier, Object.keys(countyData[carrier]));
        const testsQuantity = this.getNumberOfTests(carrier, phone, countyData);
        avgDls.push({
          x: i,
          y: parseInt(countyData[carrier][phone]["avgDl"]),
          phone: phone,
          tests: testsQuantity
        });
      });
      dataSets.push({
        data: avgDls,
        label: graph.carrierSelected! + " " + graph.countySelected!,
        fill: graphChoices.length == 1,
        tension: 0.5,
        //borderColor: 'black',
        //backgroundColor: 'rgba(255,0,0,0.3)'
      });
    });
    return {
      labels: labels,
      datasets: dataSets
    };
  }

  private getErrors(data: { [key: string]: any }, round: string, carrier: string, phone: string): number {
    const testData = data[round][carrier][phone];
    let totalError: number = testData["best d/l speeds"]["N/A"]; // n/a represents errors or tests with speeds not available
    let totalTests: number = testData["best d/l speeds"]["total tests"];
    return parseFloat(((totalError / totalTests) * 100).toFixed(1));
  }

  private getSpeeds(data: { [key: string]: any }, round: string, carrier: string, phone: string): number[] {
    // the M in speedRanges stands for Mbps
    const speedRanges = ["0M-10M", "10M-50M", "50M-100M", "100M-200M", "200M+"];
    const testData = data[round][carrier][phone];
    let speeds: number[] = [];
    let totalTests = testData["best d/l speeds"]['total tests'];
    speedRanges.forEach(speed => {
      let speedValue = testData["best d/l speeds"][speed];
      speeds.push(parseFloat(((speedValue / totalTests) * 100).toFixed(1)));
    }
    );
    return speeds;
  }

  private getNumberOfTests(carrier: string, phone: string, countyData: any): string {
    return countyData[carrier][phone]['numTests'];
  }

  private getCurrPhone(carrier: string, roundModels: string[]): string {
    const phoneMap: { [key: string]: any } = {
      'AT&T': ['SM-S901U', 'SM-G998U', 'SM-G970U', 'SM-G930A'],
      'FirstNet': ['XP8800', 'SM-G998U'],
      'Sprint': ['SM-G973U', 'SM-G930P'],
      'T-Mobile': ['SM-S901U', 'SM-G998U', 'SM-G970U', "SM-G930T"],
      'Verizon': ['SM-S901U', 'SM-G998U', 'SM-G970U', "SM-G930V"]
    };
    // console.log(roundModels)
    const models = phoneMap[carrier];
    return models.find((model: string) => {
      return roundModels.find((roundModel: string) => {
        return roundModel == model
      });
    });
  }
}

