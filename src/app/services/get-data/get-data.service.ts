import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private _csvFiles = [
    'round14', 'round15', 'round16',
    'ctyfa2017', 'ctysu2020', 'ctysp2021', 'ctyfa2021', 'ctysu2022', 'ctysp2023'
  ];
  private _graphData: Observable<any>;

  constructor(private http: HttpClient) { }

  /**
   * TODO: may want to construct forkJoinData object once and hold it as a member variable
   * 1. one for round data
   * 2. one for county data
   * 3. just return the pre-constructed observable object
   */

  public get countyData(): Observable<any> {
    const forkJoinData: any = {};
    this._csvFiles.forEach(file => {
      if (file.includes('cty')) {
        forkJoinData[file] = this.http.get(`assets/data/${file}.csv`, { responseType: 'text' })
          .pipe(map(data => { return this.processCountyData(data) }));
      }
    });
    this._graphData = forkJoin(forkJoinData);
    return this._graphData;
  }

  public get roundData(): Observable<any> {
    const forkJoinData: any = {};
    this._csvFiles.forEach(file => {
      if (file.includes('round')) {
        forkJoinData[file] = this.http.get(`assets/data/${file}.csv`, { responseType: 'text' })
          .pipe(map(data => { return this.processData(data) }));
      }
    });
    this._graphData = forkJoin(forkJoinData);
    return this._graphData;
  }

  /**
   * TODO: may want to preproccess csv to json  
   */

  /**
   * 
   * @param allText 
   * @returns 
   */
  private processCountyData(allText: string) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    type JSON_Data = {
      [key: string]: any;
    }
    var json: JSON_Data = {};

    for (var i = 1; i < allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
      if (data.length === headers.length) {
        const [county, carrier, phone, tests, income, avgDl, population] = data;
        if (!json[county]) {
          json[county] = { [carrier]: { [phone]: { "numTests": tests, "avgDl": avgDl } }, "medianIncome": income, "population": population };
        } else if (!json[county][carrier]) {
          json[county][carrier] = { [phone]: { "numTests": tests, "avgDl": avgDl } };
        } else if (!json[county][carrier][phone]) {
          json[county][carrier][phone] = { "numTests": tests, "avgDl": avgDl };
        }
      }
    }
    return json;
  }

  private processData(allText: string) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    type JSON_Data = {
      [key: string]: any;
    }
    var json: JSON_Data = {};

    for (var i = 1; i < allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
      if (data.length === headers.length) {
        let carrier = data[0];
        let phone_model = data[1];
        // the M in best d/l speeds stands for Mbps
        if (!json[carrier]) { // if carrier is not in json
          json[carrier] = {
            [phone_model]:
            {
              "best d/l speeds": {
                "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0, "N/A": 0, "total tests": 0
              },
              "total in batch": 0
            }
          };
        }
        // the M in best d/l speeds stands for Mbps
        if (!json[carrier][phone_model]) { //if phone type is not in json
          json[carrier][phone_model] =
          {
            "best d/l speeds": {
              "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0, "N/A": 0, "total tests": 0
            },
            "total in batch": 0
          };
        }
        // we are not using the error type column so skip when encounter these rows
        if (data[3] !== "N/A") {
          continue;
        }
        let statistic = data[2]; // statistic is the string of speed range
        let carrier_phone = json[carrier][phone_model];
        let bestDL = headers.length - 3;
        carrier_phone[headers[bestDL]][statistic] = parseInt(data[bestDL]);
        carrier_phone[headers[bestDL]]["total tests"] = parseInt(data[data.length - 2]);
        carrier_phone["total in batch"] = parseInt(data[data.length - 1]);
      }
    }
    return json;
  }
}
