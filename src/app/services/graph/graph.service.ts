import { Injectable } from '@angular/core';
import { GraphOptions } from 'src/app/components/side-bar/GraphOptions';
import { lineGraphOptions } from 'src/app/components/side-bar/LineGraphOptions';
import { ComponentDataService } from '../component-data/component-data.service';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  linegraphOptions;

  constructor(private compDataService: ComponentDataService) {
    this.linegraphOptions = lineGraphOptions;
  }

  public getSingleGraph(testOptions: GraphOptions): any {
    var dataSeries: number[] = [];
    const speeds = ["0M-10M", "10M-50M", "50M-100M", "100M-200M", "200M+"];

    dataSeries.push(this.getErrors(
      testOptions.graph1.roundSelected!, testOptions.graph1.carrierSelected!, testOptions.graph1.phoneSelected!
    ));

    dataSeries.push(
      ...this.getSpeeds(
        testOptions.graph1.roundSelected!, testOptions.graph1.carrierSelected!, testOptions.graph1.phoneSelected!
      )
    );

    return {
      labels: ['N/A', ...speeds],
      datasets: [
        {
          data: dataSeries,
          label: testOptions.graph1.carrierSelected + " " + this.compDataService.getModelMapValue(testOptions.graph1.phoneSelected!)
        }
      ]
    };

  }

  public comparisonGraph(testOptions: GraphOptions): any {
    var dataSets: any = [];
    const speeds = ["0M-10M", "10M-50M", "50M-100M", "100M-200M", "200M+"];

    const keys = ['graph1', 'graph2', 'graph3'];
    keys.forEach(key => {
      let option: any = testOptions[key as keyof GraphOptions];
      if (!option.carrierSelected) {
        return;
      }
      var dataSeries: number[] = [];
      dataSeries.push(this.getErrors(
        option.roundSelected!, option.carrierSelected!, option.phoneSelected!
      ));

      dataSeries.push(
        ...this.getSpeeds(
          option.roundSelected!, option.carrierSelected!, option.phoneSelected!
        )
      );
      dataSets.push(
        {
          data: dataSeries,
          label: `${this.compDataService.getRoundMapValue(option.roundSelected)} : ${option.carrierSelected} ${this.compDataService.getModelMapValue(option.phoneSelected)}`
        }
      );
    });


    return {
      labels: ['N/A', ...speeds],
      datasets: dataSets
    };
  }

  public getSingleLineGraph(graphOptions: GraphOptions, roundData: { [key: string]: any }): any {
    const labels: string[] = [
      "Spring 2021",
      "Fall 2021",
      "Summer 2022"
    ];
    // use speeds to pick correct value from getSpeeds array returned
    const speeds: { [key: string]: number } = { "0M-10M": 0, "10M-50M": 1, "50M-100M": 2, "100M-200M": 3, "200M+": 4 };
    var dataSeries: number[] = [];
    var roundKeys = Object.keys(roundData);
    roundKeys.forEach(key => {
      // county data not needed here. pass over it
      if (key == 'countyData') {
        return;
      }
      let carrier = graphOptions.graph1.carrierSelected;
      let phone = graphOptions.graph1.phoneSelected;
      let test = graphOptions.testSelected;
      let i = 0;
      // move to next phone if not in this round
      while (!roundData[key][carrier!][phone!]) {
        phone = lineGraphOptions.carriers[carrier!][i];
        i++;
      }
      if (graphOptions.testSelected === 'N/A') {
        dataSeries.push(
          this.getErrors(key, carrier!, phone!)
        );
      } else {
        // pick just the test speed from getSpeeds array
        dataSeries.push(
          this.getSpeeds(key, carrier!, phone!)[speeds[test]]
        );
      }
    }
    );
    return {
      labels: labels,
      datasets: [
        {
          data: dataSeries,
          label: graphOptions.graph1.carrierSelected,
          fill: true,
          tension: 0.5,
          //borderColor: 'black',
          //backgroundColor: 'rgba(255,0,0,0.3)'
        }
      ]
    };
  }

  public comparisonLineGraph(graphOptions: GraphOptions, roundData: { [key: string]: any }): any {
    const labels: string[] = [
      "Spring 2021",
      "Fall 2021",
      "Summer 2022"
    ];
    // use speeds to pick correct value from getSpeeds array returned
    const speeds: { [key: string]: number } = { "0M-10M": 0, "10M-50M": 1, "50M-100M": 2, "100M-200M": 3, "200M+": 4 };
    var dataSets: any = [];
    graphOptions.graphs.forEach(graphKey => {
      var dataSeries: number[] = [];
      var graph = graphOptions[graphKey as keyof GraphOptions];
      var roundKeys = Object.keys(roundData);
      roundKeys.forEach(key => {
        // county data not needed here. pass over it
        if (key == 'countyData') {
          return;
        }
        let carrier = graph.carrierSelected;
        let phone = graph.phoneSelected;
        let test = graphOptions.testSelected;
        if (!carrier) {
          return;
        }
        let i = 0;
        // move to next phone if it is not in this round
        while (!roundData[key][carrier!][phone!]) {
          phone = lineGraphOptions.carriers[carrier!][i];
          i++;
        }
        if (test === 'N/A') {
          dataSeries.push(
            this.getErrors(key, carrier!, phone!)
          );
        } else {
          // pick just the test speed from getSpeeds array
          dataSeries.push(
            this.getSpeeds(key, carrier!, phone!)[speeds[test!]]
          );
        }
      }
      );
      if (dataSeries.length) {
        dataSets.push(
          {
            data: dataSeries,
            label: graph.carrierSelected,
            fill: false,
            tension: 0.5,
            //borderColor: 'black',
            //backgroundColor: 'rgba(255,0,0,0.3)'
          }
        );
      }
    }
    );
    return {
      labels: labels,
      datasets: dataSets
    };
  }

  private getErrors(round: string, carrier: string, phone: string): number {
    const testData = this.compDataService.roundData[round][carrier][phone];
    let totalError: number = testData["best d/l speeds"]["N/A"]; // n/a represents errors or tests with speeds not available
    let totalTests: number = testData["best d/l speeds"]["total tests"];
    return parseFloat(((totalError / totalTests) * 100).toFixed(1));
  }

  private getSpeeds(round: string, carrier: string, phone: string): number[] {
    const speedRanges = ["0M-10M", "10M-50M", "50M-100M", "100M-200M", "200M+"];
    const testData = this.compDataService.roundData[round][carrier][phone];
    let speeds: number[] = [];
    let totalTests = testData["best d/l speeds"]['total tests'];
    speedRanges.forEach(speed => {
      let speedValue = testData["best d/l speeds"][speed];
      speeds.push(parseFloat(((speedValue / totalTests) * 100).toFixed(1)));
    }
    );
    return speeds;
  }
}

