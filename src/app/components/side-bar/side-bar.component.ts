import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnChanges {
  title = 'cali_broadband';
  @ViewChild('sidenav') sidenav: MatSidenav;
  roundSelected: string;
  carrierSelected: string;
  phoneSelected: string;
  serverSelected: string;
  testSelected: string;
  rounds: string[];
  carriers: string[];
  phone_models: string[];
  servers: string[];
  tests: string[];
  model_map: { [key: string]: any; };
  server_map: { [key: string]: any; };
  round14: { [key: string]: any; };
  round15: { [key: string]: any; };
  roundData: { [key: string]: any; };

  constructor(
    private getDataService: GetDataService,
    private compDataService: ComponentDataService
    ) {
    this.roundData = {};
    this.rounds = ['Round14', 'Round15'];
    this.model_map = { 'XP8800': 'Sonim XP8', 'SM-G970U': 'Galaxy S10e', 'SM-G998U': 'Galaxy S21', 'SM-G973U': 'Galaxy S10' };
    this.server_map  = { 'wTCPup1': "West Uploads", 'wTCPdown1': "West Downloads", 'eTCPup1': "East Uploads", 'eTCPdown1': "East Downloads" };
  }

  ngOnInit(): void {
    /*
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
    */
   this.getDataService.setCSVs();
   this.getDataService.getRound('round14.csv')
      .subscribe((result) => {
        this.roundData['Round14'] = result;
      });
    this.getDataService.getRound('round15.csv')
      .subscribe((result) => {
        this.roundData['Round15'] = result;
      });
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
    if (this.carrierSelected) {
      this.phone_models = Object.keys(this.roundData[this.roundSelected][this.carrierSelected]);
    }
    if (this.phoneSelected) {
      this.servers = Object.keys(this.roundData[this.roundSelected][this.carrierSelected][this.phoneSelected])
        .filter((value) => {
          return (value.includes('1'));
        });
    }
    if (this.serverSelected) {
      this.tests = ["Speeds", "Errors"];
    }
    if (this.testSelected) {
      this.compDataService.updateFlag(false);
    }
  }
}