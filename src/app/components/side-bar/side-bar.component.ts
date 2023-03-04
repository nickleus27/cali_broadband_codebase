import { Component, OnChanges, OnInit } from '@angular/core';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { SidebarStateService } from 'src/app/services/sidebar-state/sidebar-state.service';
import { GraphOptions } from './GraphOptions';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnChanges {
  title = 'cali_broadband';
  graphSelected: string;
  graphOptions: GraphOptions;
  optionsSelected: any;
  graphs: string[];
  roundData: { [key: string]: any; };

  constructor(
    private getDataService: GetDataService,
    public compDataService: ComponentDataService,
    private sidebarState: SidebarStateService
  ) {
    this.roundData = {};

    this.setSideNavOptions();

    this.compDataService.isBarGraph.subscribe(value => this.graphOptions.isBarGraph = value);

    this.compDataService.reset_opts = this.reSetSideNavOptions;

    // subscribe to comparison button click...
    this.compDataService.displaySideNavComp.subscribe(flag => {
      this.graphOptions.comparison = flag;
      if (this.graphOptions.comparison) {
        this.compDataService.updateNumCompGraphs();
        let index: number = this.compDataService.numCompGraphs;
        this.graphOptions.graphSelected = this.graphOptions.graphs[index];
        this.optionsSelected = this.graphOptions[this.graphOptions.graphSelected as keyof GraphOptions];
        this.sidebarState.state = this.graphOptions.graphSelected;
        this.graphs.push(this.graphOptions.graphSelected); //add another graph radio button to sidenav
        this.ngOnChanges();
      }
    });

    this.compDataService.displayPhoneFlag
      .subscribe(flag => {
        this.optionsSelected.phoneSelected = flag;
        this.ngOnChanges();
      });
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

  private setSideNavOptions(): void{
    this.graphOptions = {
      comparison: false,
      rounds: ['round14', 'round15', 'round16'],
      graphs: ['graph1', 'graph2', 'graph3'],
      graphSelected: 'graph1',
      graph1: {},
      graph2: {},
      graph3: {}
    };
    this.optionsSelected = this.graphOptions.graph1;
    this.graphs = [this.graphOptions.graphs[0]];
    this.graphSelected = this.graphOptions.graphSelected;
  }

  reSetSideNavOptions = () => {
    this.setSideNavOptions();
    this.compDataService.numCompGraphs = 0; // reset number of graphs
    this.sidebarState.reset(); // reset sidenav state
    this.ngOnChanges(); // re-render sidenav
  }

  /* update all phone selected between multiple graph options */
  private _setPhoneModels(): void {
    this.optionsSelected.phone_models = Object.keys(this.roundData[this.graphOptions.roundSelected!][this.optionsSelected.carrierSelected]);
    this.graphOptions.graphs.forEach( graph =>
      {
        let option: any = this.graphOptions[graph as keyof GraphOptions];
        if (option && option.phoneSelected) {
          let carrier_phone_options = Object.keys(this.roundData[this.graphOptions.roundSelected!][option.carrierSelected]);
          /* not all rounds have the same phone models per carrier */
          /* check for phone models for each graph and pick the first phone option if phone is no longer present */
          if (!carrier_phone_options.includes(option.phoneSelected)) {
            option.phoneSelected = carrier_phone_options[0];
          }
        }
      })
  }

  ngOnChanges(): void {
    this.optionsSelected = this.graphOptions[this.graphOptions.graphSelected as keyof GraphOptions];
    if (this.graphOptions.roundSelected) {
      this.optionsSelected.carriers = Object.keys(this.roundData[this.graphOptions.roundSelected])
        .filter((value) => {
          if (value === 'na') {
            return false;
          } else if (value === 'Verizon Wireless') {
            return false;
          }
          return true;
        });
    }
    if (this.optionsSelected.carrierSelected) {
      this._setPhoneModels();
      //this.optionsSelected.phone_models = Object.keys(this.roundData[this.graphOptions.roundSelected!][this.optionsSelected.carrierSelected]);
    }
    if (this.optionsSelected.phoneSelected) {
      if (this.optionsSelected.phone_models.includes(this.optionsSelected.phoneSelected)) {
        this.optionsSelected.servers = Object.keys(this.roundData[this.graphOptions.roundSelected!][this.optionsSelected.carrierSelected][this.optionsSelected.phoneSelected])
          .filter((value) => {
            return (value.includes('1')); // filter out only servers from group 1. example: wTCPup1
          });
      } else {
        this.optionsSelected.phoneSelected = this.optionsSelected.phone_models[0];
      }
    }
    // check to see if change was graphselected
    // if it was do not setGraphParams
    if (this.graphSelected !== this.graphOptions.graphSelected) {
      this.graphSelected = this.graphOptions.graphSelected;
      return;
    }
    //check for both phoneSelected & serverSelected for comparison graph which will already have server always selected
    if (this.optionsSelected.phoneSelected && this.graphOptions.serverSelected) {
      this.sidebarState.acceptingState(this.graphOptions.graphSelected);
      this.getDataService.setGraphParams(this.graphOptions);
      if (this.sidebarState.accepting) {
        this.compDataService.updateGraphButtonFlag(false);
        if (this.compDataService.numCompGraphs < 2) {
          this.compDataService.updateCompButtonFlag(false);
        }
      }
    }
  }
}