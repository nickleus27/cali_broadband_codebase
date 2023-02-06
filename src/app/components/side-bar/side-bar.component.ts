import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
//import { MatSidenav } from '@angular/material/sidenav';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnChanges {
  title = 'cali_broadband';
  //@ViewChild('sidenav') sidenav: MatSidenav;
  homePage: boolean;
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
  round14: { [key: string]: any; };
  round15: { [key: string]: any; };
  roundData: { [key: string]: any; };

  constructor(
    public getDataService: GetDataService,
    private compDataService: ComponentDataService
    ) {
    this.roundData = {};
    this.rounds = ['Round14', 'Round15'];
    this.compDataService.sideNavFlag.subscribe(flag => {this.homePage = flag; console.log("sidenav flag", this.homePage)});
  }

  ngOnInit(): void {
   //this.getDataService.setCSVs();
   this.getDataService.getRound('round14')
      .subscribe((result) => {
        this.roundData['Round14'] = result;
      });
    this.getDataService.getRound('round15')
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
      this.getDataService.setGraphParams({option1:{
        round: this.roundSelected, 
        carrier: this.carrierSelected,
        phone: this.phoneSelected,
        server: this.serverSelected,
        test: this.testSelected
      }});
      this.compDataService.updateGraphButtonFlag(false);
    }
  }
}