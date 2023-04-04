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
    
    dataSeries.push(this.findHighestErrors(
      testOptions.graph1.roundSelected!, testOptions.graph1.carrierSelected!, testOptions.graph1.phoneSelected!
    ));

    dataSeries.push(
      ...this.findBestSpeeds(
      testOptions.graph1.roundSelected!, testOptions.graph1.carrierSelected!, testOptions.graph1.phoneSelected!
      )
    );

    return {labels: ['N/A',...speeds],
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
    keys.forEach(key =>
      {
        let option: any = testOptions[key as keyof GraphOptions];
        if (!option.carrierSelected) {
          return;
        }
        var dataSeries: number[] = [];
        dataSeries.push(this.findHighestErrors(
          option.roundSelected!, option.carrierSelected!, option.phoneSelected!
        ));

        dataSeries.push(
          ...this.findBestSpeeds(
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

    
    return {labels: ['N/A',...speeds],
      datasets: dataSets
    };
  }

  public getSingleLineGraph(graphOptions: GraphOptions, roundData: {[key:string]:any}): any {
    const labels: string[] = [
      "Spring 2021",
      "Fall 2021",
      "Summer 2022"
    ];
    const speeds: {[key:string]:number} = {"0M-10M":0, "10M-50M":1, "50M-100M":2, "100M-200M":3, "200M+":4};
    var dataSeries: number[] = [];
    var roundKeys = Object.keys(roundData);
    roundKeys.forEach(key => 
      {
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
            this.findHighestErrors(key, carrier!, phone!)
          );
        } else {

          dataSeries.push(
            this.findBestSpeeds(key, carrier!, phone!)[speeds[test]]
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

  public comparisonLineGraph(graphOptions: GraphOptions, roundData: {[key:string]:any}): any {
    const labels: string[] = [
      "Spring 2021",
      "Fall 2021",
      "Summer 2022"
    ];
    const speeds: {[key:string]:number} = {"0M-10M":0, "10M-50M":1, "50M-100M":2, "100M-200M":3, "200M+":4};
    var dataSets: any = [];
    graphOptions.graphs.forEach(graphKey =>
      {
        var dataSeries: number[] = [];
        var graph = graphOptions[graphKey as keyof GraphOptions];
        var roundKeys = Object.keys(roundData);
        roundKeys.forEach(key => 
          {
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
                this.findHighestErrors(key, carrier!, phone!)
              );
            } else {
              dataSeries.push(
                this.findBestSpeeds(key, carrier!, phone!)[speeds[test!]]
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
    return {labels: labels,
      datasets: dataSets
    };
  }

  private findTotalErrors(testData:any, server: string):number {
    const errors = ["timeout", "no effective service", "connect_error2", "bad_output", "unknown_error"];
    testData = testData[server];
    let totalTests: number = parseInt(testData['total tests']);
    let totalError = 0;
    errors.forEach(element =>
      {
        totalError += parseInt(testData[element]);
      }
    );
    totalError = parseInt(((totalError/totalTests)*100).toFixed());
    return totalError;
  }
  private findHighestErrors(round: string, carrier: string, phone: string): number {
    const testData = this.compDataService.round_data[round][carrier][phone];
    const servers = ["wTCPdown1", "wTCPdown2", "eTCPdown1", "eTCPdown2"];
    let maxErrors: number = 0;
    servers.forEach(server =>
      {
        let errors = this.findTotalErrors(testData, server);
        if (!maxErrors || maxErrors < errors) {
          maxErrors = errors;
        }
      }
    );
    return maxErrors;
  }

  private findBestSpeeds(round:string, carrier:string, phone:string): [] {
    const speeds = ["0M-10M", "10M-50M", "50M-100M", "100M-200M", "200M+"];
    const servers = ["wTCPdown1", "wTCPdown2", "eTCPdown1", "eTCPdown2"];
    const testData = this.compDataService.round_data[round][carrier][phone];
    let bestSpeeds:any = [];
    speeds.forEach(speed =>
      {
        let maxSpeed = 0;
        let totalTests = 0;
        servers.forEach(server =>
          {
            let serverData = testData[server];
            let value: number = parseInt(serverData[speed]);
            if (!maxSpeed || maxSpeed < value) {
              maxSpeed = value;
              totalTests = parseInt(serverData['total tests']);
            }
          }
        );
        bestSpeeds.push(parseInt(((maxSpeed/totalTests)*100).toFixed()));
      }
    );
    return bestSpeeds;
  }
}

