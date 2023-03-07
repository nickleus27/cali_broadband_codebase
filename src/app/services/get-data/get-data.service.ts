import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  private _csvFiles = ['round14', 'round15', 'round16'];
  private _graphData: {[key:string]: Subject<any>};
  private _graph_params: Subject<any>;

  constructor(private http: HttpClient) {
    this._graphData = {};
    this._csvFiles.forEach((element) => {
      this._graphData[element] = new BehaviorSubject({});
    });
    Object.keys(this._graphData).forEach(key => {
      this.http.get(`assets/data/${key}.csv`, { responseType: 'text' })
        .subscribe((result) => {
          this._graphData[key].next(this.processData(result));
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

  public getAllRounds(): any {
    return this._graphData;
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
              "wTCPup1": {
                "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
                "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
              },
              "wTCPdown1": {
                "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
                "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
              },
              "eTCPup1": {
                "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
                "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
              },
              "eTCPdown1": {
                "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
                "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
              },
              "wTCPup2": {
                "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
                "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
              },
              "wTCPdown2": {
                "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
                "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
              },
              "eTCPup2": {
                "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
                "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
              },
              "eTCPdown2": {
                "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
                "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
              },
              "total in batch": 0
            }
          };
        }
        if (!json[carrier][phone_model]) { //if phone type is not in json
          json[carrier][phone_model] =
          {
            "wTCPup1": {
              "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
              "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
            },
            "wTCPdown1": {
              "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
              "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
            },
            "eTCPup1": {
              "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
              "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
            },
            "eTCPdown1": {
              "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
              "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
            },
            "wTCPup2": {
              "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
              "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
            },
            "wTCPdown2": {
              "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
              "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
            },
            "eTCPup2": {
              "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
              "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
            },
            "eTCPdown2": {
              "200M+": 0, "100M-200M": 0, "50M-100M": 0, "10M-50M": 0, "0M-10M": 0,
              "timeout": 0, "no effective service": 0, "connect_error2": 0, "bad_output": 0, "unknown_error": 0, "total tests": 0
            },
            "total in batch": 0
          };
        }
        let statistic = json[carrier][phone_model]["wTCPup1"][data[2]] !== undefined ? data[2] : data[3]; // statistic is the string of error type or speed range
        let carrier_phone = json[carrier][phone_model];
        for (var server = 4; server < headers.length - 2; server++) {
          carrier_phone[headers[server]][statistic] = data[server];
          carrier_phone[headers[server]]["total tests"] = data[data.length - 2];
        }
        carrier_phone["total in batch"] = data[data.length - 1];
      }
    }
    return json;
  }
}
