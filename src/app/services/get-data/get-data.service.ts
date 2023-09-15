import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private _csvFiles = ['round14', 'round15', 'round16',
    'ctyfa2017', 'ctyfa2021', 'ctysp2021',
    'ctysp2023', 'ctysu2020', 'ctysu2022'
  ];
  private _graphData: { [key: string]: any };
  private _graph_params: Subject<any>;

  constructor(private http: HttpClient) {
    this._graphData = {};
    this._csvFiles.forEach(key => {
      this.http.get(`assets/data/${key}.csv`, { responseType: 'text' })
        .subscribe((result) => {
          if (key.includes('round')) {
            this._graphData[key] = this.processData(result);
          } else {
            if (!this._graphData["countyData"]) {
              this._graphData["countyData"] = { [key]: this.processCountyData(result) };
            } else {
              this._graphData["countyData"][key] = this.processCountyData(result);
            }
          }
        });
    });
    this._graph_params = new BehaviorSubject({});
  }

  public getGraphParams(): Observable<any> {
    return this._graph_params.asObservable();
  }

  public setGraphParams(params: object) {
    this._graph_params.next(params);
  }

  public getRound(round: string): Observable<any> {
    return this._graphData[round].asObservable();
  }

  public getCountyData(round: string): Observable<any> {
    return this._graphData[round].asObservable();
  }

  public get roundData(): Observable<any> {
    return from([this._graphData]);
  }

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
