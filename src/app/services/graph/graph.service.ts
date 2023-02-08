import { Injectable } from '@angular/core';

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
      //{ data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    };

  }
}
