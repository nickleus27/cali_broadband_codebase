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

  public getSingleGraph(testData: {[key:string]:any}, testOptions: GraphOptions): any {
    var dataSeries: number[] = [];
    const speeds = ["0M-10M", "10M-50M", "50M-100M", "100M-200M", "200M+"];
    const errors = ["timeout", "no effective service", "connect_error2", "bad_output", "unknown_error"];
    let totalTests: number = parseInt(testData['total tests']);

    let totalError = 0;
    errors.forEach(element =>
      {
        totalError += parseInt(testData[element]);
      }
    );
    totalError = parseInt(((totalError/totalTests)*100).toFixed());
    dataSeries.push(totalError);

    speeds.forEach(element =>
      {
        let value: number = parseInt(testData[element]);
        dataSeries.push(parseInt(((value/totalTests)*100).toFixed()));
      }
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

  public comparisonGraph(roundData: {[key:string]:any}, testOptions: GraphOptions): any {
    var dataSets: any = [];
    const speeds = ["0M-10M", "10M-50M", "50M-100M", "100M-200M", "200M+"];
    const errors = ["timeout", "no effective service", "connect_error2", "bad_output", "unknown_error"];

    const keys = ['graph1', 'graph2', 'graph3'];
    keys.forEach(key =>
      {
        let option: any = testOptions[key as keyof GraphOptions];
        if (!option.carrierSelected) {
          return;
        }
        let testData = roundData[option.carrierSelected][option.phoneSelected][testOptions.serverSelected!];
        let totalError: number = 0;
        let totalTests: number = parseInt(testData['total tests']);
        var dataSeries: number[] = [];
        errors.forEach(element => 
          {
            totalError += parseInt(testData[element]);
          }
        );
        totalError = parseInt(((totalError/totalTests)*100).toFixed());
        dataSeries.push(totalError);

        speeds.forEach(element => 
          {
            let value = parseInt(((parseInt(testData[element])/totalTests)*100).toFixed());
            dataSeries.push(value);
          }
        );
        dataSets.push({data: dataSeries, label: option.carrierSelected + ' ' + option.phoneSelected});
      });

    
    return {labels: ['N/A',...speeds],
      datasets: dataSets
    };
  }

  public getSingleLineGraph(graphOptions: GraphOptions, roundData: {[key:string]:any}): any {
    var labels: string[] = [
      "Spring 2021",
      "Fall 2021",
      "Summer 2022"
    ];
    var dataSeries: number[] = [];
    var roundKeys = Object.keys(roundData);
    roundKeys.forEach(key => 
      {
        let carrier = graphOptions.graph1.carrierSelected;
        let phone = graphOptions.graph1.phoneSelected;
        let server = graphOptions.serverSelected;
        let test = graphOptions.testSelected;
        let i = 0;
        while (!roundData[key][carrier!][phone!]) {
          phone = lineGraphOptions.carriers[carrier!][i];
          i++;
        }
        let totalTests = parseInt(roundData[key][carrier!][phone!][server!]['total tests']);
        if (graphOptions.testSelected === 'N/A') {
          const errors = ["timeout", "no effective service", "connect_error2", "bad_output", "unknown_error"];
          let totalError = 0;
          errors.forEach(element => 
            {
              totalError += parseInt(roundData[key][carrier!][phone!][server!][element]);
            }
          );
          totalError = parseInt(((totalError/totalTests)*100).toFixed());
          dataSeries.push(totalError);
        } else {
          dataSeries.push(
            parseInt(((parseInt(roundData[key][carrier!][phone!][server!][test])/totalTests)*100).toFixed())
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
    var labels: string[] = [
      "Spring 2021",
      "Fall 2021",
      "Summer 2022"
    ];
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
            let server = graphOptions.serverSelected;
            let test = graphOptions.testSelected;
            if (!carrier) {
              return;
            }
            let i = 0;
            while (!roundData[key][carrier!][phone!]) {
              phone = lineGraphOptions.carriers[carrier!][i];
              i++;
            }
            let totalTests = parseInt(roundData[key][carrier][phone][server!]['total tests']);
            if (test === 'N/A') {
              const errors = ["timeout", "no effective service", "connect_error2", "bad_output", "unknown_error"];
              let totalError = 0;
              errors.forEach(element => 
                {
                  totalError += parseInt(roundData[key][carrier!][phone!][server!][element]);
                }
              );
              totalError = parseInt(((totalError/totalTests)*100).toFixed());
              dataSeries.push(totalError);
            } else {
              dataSeries.push(
                parseInt(((parseInt(roundData[key][carrier!][phone!][server!][test])/totalTests)*100).toFixed())
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
}

