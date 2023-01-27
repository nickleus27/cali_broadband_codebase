import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { GetDataService } from './services/get-data/get-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  title = 'cali_broadband';
  @ViewChild('sidenav') sidenav: MatSidenav;
  roundSelected: string;
  carrierSelected: string;
  rounds: string[] = ['Round14', 'Round15'];
  carriers: string[] = [];
  round14: { [key: string]: any; };
  round15: { [key: string]: any; };
  roundData: {
    [key: string]: any,
  };


  constructor(public getDataService: GetDataService) {
    this.roundData = {};
    this.carriers = [];
  }

  ngOnInit(): void {
    this.getDataService.getCSV('round14.csv').subscribe(
      data => {
        this.round14 = this.getDataService.processData(data);
        this.roundData['Round14'] = this.round14;
        //console.log(this.roundData);
      }
    );
    this.getDataService.getCSV('round15.csv').subscribe(
      data => {
        this.round15 = this.getDataService.processData(data);
        this.roundData['Round15'] = this.round15;
        //console.log(this.roundData);
      }
    );
  }
  ngOnChanges(changes: any): void {
    console.log(this.roundSelected);
    console.log(Object.keys(this.roundData[this.roundSelected]));
    this.carriers = Object.keys(this.roundData[this.roundSelected]);
  }
}
