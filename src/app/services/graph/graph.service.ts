import { Injectable } from '@angular/core';
import { GraphOptions } from 'src/app/components/graph-options-dialogs/GraphOptionsModels/GraphOptions';
import { ComponentDataService } from '../component-data/component-data.service';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private compDataService: ComponentDataService) { }

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
      var dataSeries: any[] = [];
      rounds.forEach((round, i) => {
        let carrier = graph.carrierSelected!;
        let phone = this.getCurrPhone(carrier, Object.keys(data[round][carrier]))
        let speedRange = graph.speedRangeSelected!;
        if (speedRange === 'N/A') {
          dataSeries.push({
            x: i,
            y: this.getErrors(data, round, carrier, phone),
            speedRange: speedRange
          });
        } else {
          // pick just the test speed from getSpeeds array
          dataSeries.push({
            x: i,
            y: this.getSpeeds(data, round, carrier, phone)[speeds[speedRange!]],
            speedRange: speedRange
          });
        }
      });
      dataSets.push({
        data: dataSeries,
        label: graph.carrierSelected,
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
        const county = graph.countySelected!;
        const data: any = roundData[round];
        const carrier = graph.carrierSelected! === 'All Carriers' ? 'all_carrier' : graph.carrierSelected!;
        // make a phone an array so you can pass by reference
        const phone = [(county === 'Entire State' || carrier === 'all_carrier') ? 'NA' : this.getCurrPhone(carrier, Object.keys(data[county][carrier]))];
        const avgDlSpeed = this.getAvgDl(county, carrier, phone, data);
        const testsQuantity = this.getNumberOfTests(county, carrier, phone, data);
        avgDls.push({
          x: i,
          y: avgDlSpeed,
          phone: phone[0],
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
  /**
   * 
   * TODO: Test Data Display for correctness
   * 
   */
  private getAvgDl(county: string, carrier: string, phone: string[], data: { [key: string]: any }): number {
    if (county !== 'Entire State') { // this is for "specific county"
      return parseInt(data[county][carrier][phone[0]]["avgDl"]);
    }
    let avgDl: number = 0;
    let count: number = 0;
    if (carrier === 'all_carrier') { // this is for "entire state", "all carriers"
      Object.keys(data).forEach(countyKey => { // find average of all counties in state
        avgDl += parseInt(data[countyKey][carrier][phone[0]]['avgDl']);
        count++;
      });
    } else { // this is for "entire state", "specific carrier"
      const countyList = Object.keys(data);
      phone[0] = this.getCurrPhone(carrier, Object.keys(data[countyList[0]][carrier]));
      countyList.forEach(countyKey => {
        avgDl += parseInt(data[countyKey][carrier][phone[0]]['avgDl']);
        count++;
      });
      // Object.keys(data).forEach(countyKey => { // find average of all counties in state
      //   let countyPhone = this.getCurrPhone(carrier, Object.keys(data[countyKey][carrier]));
      //   avgDl += parseInt(data[countyKey][carrier][countyPhone]['avgDl']);
      //   count++;
      // });
    }
    return Math.round(avgDl / count);
  }

  private getNumberOfTests(county: string, carrier: string, phone: string[], data: any): string {
    if (county !== 'Entire State') { // this is for "specific county"
      return data[county][carrier][phone[0]]["numTests"];
    }
    let totalTests: number = 0;
    if (carrier === 'all_carrier') { // this is for "entire state", "all carriers"
      Object.keys(data).forEach(countyKey => { // sum the number of tests in each county
        totalTests += parseInt(data[countyKey][carrier][phone[0]]['numTests']);
      });
    } else { // this is for "entire state", "specific carrier"
      const countyList = Object.keys(data);
      phone[0] = this.getCurrPhone(carrier, Object.keys(data[countyList[0]][carrier]));
      countyList.forEach(countyKey => {
        totalTests += parseInt(data[countyKey][carrier][phone[0]]['numTests']);;
      });
      // Object.keys(data).forEach(countyKey => { // sum the number of tests in each county
      //   let countyPhone = this.getCurrPhone(carrier, Object.keys(data[countyKey][carrier]));
      //   totalTests += parseInt(data[countyKey][carrier][countyPhone]['numTests']);
      // });
    }
    return totalTests.toString();
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

