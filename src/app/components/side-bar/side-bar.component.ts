import { Component, OnChanges, OnInit } from '@angular/core';
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
  roundSelected: string;
  carrierSelected: string;
  phoneSelected: string;
  serverSelected: string;
  rounds: string[];
  carriers: string[];
  phone_models: string[];
  servers: string[];
  round14: { [key: string]: any; };
  round15: { [key: string]: any; };
  roundData: { [key: string]: any; };

  constructor(
    private getDataService: GetDataService,
    public compDataService: ComponentDataService
    ) {
    this.roundData = {};
    this.rounds = ['round14', 'round15', 'round16'];
    this.compDataService.displayPhoneFlag
      .subscribe(flag =>
        { this.phoneSelected = flag;
          this.ngOnChanges();
        }
      );
  }

  ngOnInit(): void {
   this.getDataService.getRound('round14')
      .subscribe((result) => {
        this.roundData['round14'] = result;
      });
    this.getDataService.getRound('round15')
      .subscribe((result) => {
        this.roundData['round15'] = result;
      });
    this.getDataService.getRound('round16')
      .subscribe((result) => {
        this.roundData['round16'] = result;
      });
  }
  ngOnChanges(): void {
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
      if (this.phone_models.includes(this.phoneSelected)) {
        this.servers = Object.keys(this.roundData[this.roundSelected][this.carrierSelected][this.phoneSelected])
          .filter((value) => {
            return (value.includes('1')); // filter out onley servers from group 1. example: wTCPup1
          });
      } else {
        this.phoneSelected = '';
      }
    }
    if (this.serverSelected) {
      this.getDataService.setGraphParams({option1:{
        round: this.roundSelected, 
        carrier: this.carrierSelected,
        phone: this.phoneSelected,
        server: this.serverSelected,
      }});
      this.compDataService.updateGraphButtonFlag(false);
    }
  }
}