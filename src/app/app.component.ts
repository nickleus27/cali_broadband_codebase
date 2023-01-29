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
  phoneSelected: string;
  rounds: string[];
  carriers: string[];
  phone_models: string[];
  model_map: { [key: string]: any; } = { 'XP8800': 'Sonim XP8', 'SM-G970U': 'Galaxy S10e', 'SM-G998U': 'Galaxy S21', 'SM-G973U': 'Galaxy S10'};
  round14: { [key: string]: any; };
  round15: { [key: string]: any; };
  roundData: { [key: string]: any; };

  constructor(public getDataService: GetDataService) {
    this.roundData = {};
    this.rounds = ['Round14', 'Round15'];
    this.carriers = [];
    this.phone_models = [];
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
    if (this.roundSelected) {
      this.carriers = Object.keys(this.roundData[this.roundSelected])
        .filter((value) => { 
          if (value === 'na') {
            return false;
          } else if (value === 'Verizon Wireless') {
            return false;
          }
          return true;
        });
    }
    if (this.roundSelected && this.carrierSelected) {
      this.phone_models = Object.keys(this.roundData[this.roundSelected][this.carrierSelected]);
    }
  }
}
