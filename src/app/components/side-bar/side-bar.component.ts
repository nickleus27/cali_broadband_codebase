import { Component, OnChanges, OnInit } from '@angular/core';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { SidebarStateService } from 'src/app/services/sidebar-state/sidebar-state.service';
import { GraphOptions } from './GraphOptions';
import { lineGraphOptions, LineGraphOptions } from './LineGraphOptions';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnChanges {
  graphSelected: string;
  graphOptions: GraphOptions;
  optionsSelected: any;
  lineGraphOptions: LineGraphOptions;
  graphs: string[];
  roundData: { [key: string]: any; };
  isLoading;

  constructor(
    private getDataService: GetDataService,
    public compDataService: ComponentDataService,
    private sidebarState: SidebarStateService
  ) {
    this.isLoading = true;
    this.roundData = {};

    this.setSideNavOptions();

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
        if (!this.isLoading) {
          this.ngOnChanges();
        }
      });

    this.compDataService.graphType.subscribe(value =>
      {
        this.graphOptions.graphType = value;
        if (!this.isLoading) {
          this.reSetSideNavOptions();
        }
      }
    );
    this.lineGraphOptions = lineGraphOptions;
    this.isLoading = false;
  }

  ngOnInit(): void {
    /** 
     * TODO: need to get county aggregated csv data here
     */
    this.getDataService.getRound('round14')
      .subscribe((result) => {
        this.roundData['round14'] = result;
        //work around for now
        this.compDataService.round_data = this.roundData;
      });
    this.getDataService.getRound('round15')
      .subscribe((result) => {
        this.roundData['round15'] = result;
        //work around for now
        this.compDataService.round_data = this.roundData;
      });
    this.getDataService.getRound('round16')
      .subscribe((result) => {
        this.roundData['round16'] = result;
        //work around for now
        this.compDataService.round_data = this.roundData;
      });
      // this.getDataService.getCountyData('county_data_fall_2017').subscribe(result => console.log(1));
      // this.getDataService.getCountyData('county_data_fall_2021').subscribe(result => console.log(2));
      // this.getDataService.getCountyData('county_data_spring_2021').subscribe(result => console.log(3));
      // this.getDataService.getCountyData('county_data_spring_2023').subscribe(result => console.log(4));
      // this.getDataService.getCountyData('county_data_summer_2020').subscribe(result => console.log(5));
      // this.getDataService.getCountyData('county_data_summer_2022').subscribe(result => console.log(6));
  }

  private setSideNavOptions(): void{
    this.graphOptions = {
      comparison: false,
      rounds: ['round14', 'round15', 'round16'],
      graphs: ['graph1', 'graph2', 'graph3'],
      /**
       * TODO: add correct county list in. need to add csv's in.
       */
      counties: ['placeholder1', 'placeholder2'],
      graphSelected: 'graph1',
      graph1: {},
      graph2: {},
      graph3: {}
    };
    this.optionsSelected = this.graphOptions.graph1;
    this.graphs = [this.graphOptions.graphs[0]];
    this.graphSelected = this.graphOptions.graphSelected;
    this.compDataService.graphType.subscribe(value => this.graphOptions.graphType = value);
  }

  reSetSideNavOptions = () => {
    this.compDataService.updateGraphButtonFlag(true);
    this.compDataService.updateCompButtonFlag(true);
    this.compDataService.updateSideNavComp(false);
    this.setSideNavOptions();
    this.compDataService.numCompGraphs = 0; // reset number of graphs
    this.sidebarState.reset(); // reset sidenav state
    this.ngOnChanges(); // re-render sidenav
  }

  private _changeRound(): void {
    if (this.graphOptions.graphType == 'bar-graph') {
      if (this.optionsSelected.roundSelected) {
        this.optionsSelected.carriers = Object.keys(this.roundData[this.optionsSelected.roundSelected])
          .filter((value) => {
            if (value === 'na') {
              return false;
            } else if (value === 'Verizon Wireless') {
              return false;
            }
            return true;
          });
      }
    } else {
      this.optionsSelected.carriers = Object.keys(this.lineGraphOptions.carriers);
    }
  }

  /* update all phone selected between multiple graph options */
  private _changePhoneModels(): void {
    if (this.graphOptions.graphType == 'bar-graph') {
      if (this.optionsSelected.carrierSelected) {
        this.optionsSelected.phone_models = Object.keys(this.roundData[this.optionsSelected.roundSelected!][this.optionsSelected.carrierSelected]);
      }
    } else {
      if (this.optionsSelected.carrierSelected) {
        this.optionsSelected.phone_models = this.lineGraphOptions.carriers[this.optionsSelected.carrierSelected];
      }
    }
  }

  private _checkPhoneSelected(): void {
    // check to see if phone model is still included in phone options if carrier or round changed
    if (this.optionsSelected.phoneSelected && !this.optionsSelected.phone_models.includes(this.optionsSelected.phoneSelected)) {
      // if not in the list select the first model in the list
      this.optionsSelected.phoneSelected = this.optionsSelected.phone_models[0];
    }
  }

  private _changeBarGraphState(): void {
    if (this.graphOptions.graphType == 'bar-graph' && this.optionsSelected.phoneSelected) {
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

  private _changeLineGraphState(): void {
    if (this.graphOptions.graphType == 'line-graph' && this.optionsSelected.phoneSelected && this.graphOptions.testSelected) {
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

  ngOnChanges(): void {
    this.optionsSelected = this.graphOptions[this.graphOptions.graphSelected as keyof GraphOptions];
    this._changeRound();
    this._changePhoneModels();
    this._checkPhoneSelected();
    // check to see if change was graphselected
    // if it was do not setGraphParams
    if (this.graphSelected !== this.graphOptions.graphSelected) {
      this.graphSelected = this.graphOptions.graphSelected;
      return;
    }
    this._changeBarGraphState();
    this._changeLineGraphState();
  }
}