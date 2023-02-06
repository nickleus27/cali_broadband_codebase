import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor() { }

public getSpeedGraph(testData: {[key:string]:any}): any{
    var graph: number[] = [];
    const speeds = ["0M-10M", "10M-50M", "50M-100M", "100M-200M", "200M+"];
    speeds.forEach(element => 
      {
        graph.push(parseInt(testData[element]));
        console.log(testData[element]);
      }
    );

    return {labels: speeds,
      datasets: [{ data: graph, label: 'Series A' },]
      //{ data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    };

  }

  getErrorGraph(testData: {[key:string]:any}): any {
    var graph: number[] = [];
    const errors = ["timeout", "no effective service", "connect_error2", "bad_output", "unknown_error"];
    errors.forEach(element => 
      {
        graph.push(parseInt(testData[element]));
        console.log(testData[element]);
      }
    );
    return {labels: errors,
      datasets: [{ data: graph, label: 'Series A' },]
      //{ data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    };
  }
}
