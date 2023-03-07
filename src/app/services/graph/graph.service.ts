import { Injectable } from '@angular/core';
import { GraphOptions } from 'src/app/components/side-bar/GraphOptions';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor() { }

  public getSingleGraph(testData: {[key:string]:any}): any {
    var dataSeries: number[] = [];
    const speeds = ["0M-10M", "10M-50M", "50M-100M", "100M-200M", "200M+"];
    const errors = ["timeout", "no effective service", "connect_error2", "bad_output", "unknown_error"];

    let totalError = 0;
    errors.forEach(element => 
      {
        totalError += parseInt(testData[element]);
      }
    );
    dataSeries.push(totalError);

    speeds.forEach(element => 
      {
        dataSeries.push(parseInt(testData[element]));
      }
    );

    return {labels: ['N/A',...speeds],
      datasets: [{ data: dataSeries, label: 'Total Tests: ' + testData['total tests'] },]
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
        if (graphOptions.testSelected === 'N/A') {
          const errors = ["timeout", "no effective service", "connect_error2", "bad_output", "unknown_error"];
          let totalError = 0;
          errors.forEach(element => 
            {
              totalError += parseInt(roundData[key][carrier!][phone!][server!][element]);
            }
          );
          dataSeries.push(totalError);
        } else {
          console.log("key", key);
          console.log("carrier", carrier);
          console.log("phone", phone);
          console.log("server", server);
          console.log("test: ", test);
          dataSeries.push(
            parseInt(roundData[key][carrier!][phone!][server!][test])
          );
        }
      }
    );

    return {
      labels: labels,
      datasets: [
        {
          data: dataSeries,
          label: 'Series A',
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(255,0,0,0.3)'
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
        dataSets.push({data: dataSeries, label: '% ' + option.carrierSelected + ' ' + option.phoneSelected});
      });

    
    return {labels: ['N/A',...speeds],
      datasets: dataSets
    };
  }
}
