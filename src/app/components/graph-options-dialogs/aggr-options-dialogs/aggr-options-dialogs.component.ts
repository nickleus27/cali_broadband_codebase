import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { OptionsDialog } from '../OptionsDialogInterface/OptionsDialog';
import { BehaviorSubject } from 'rxjs';
import { GraphOptions } from '../GraphOptionsModels/GraphOptions';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { ActivatedRoute, Router } from '@angular/router';

export enum DialogViews {
  aggrOptsView,
  stateDataView
};

@Component({
  selector: 'app-aggr-options-dialogs',
  templateUrl: './aggr-options-dialogs.component.html',
  styleUrls: ['./aggr-options-dialogs.component.css']
})

export class AggrOptionsDialogsComponent implements OptionsDialog, OnChanges {
  dialogViews;
  aggrOpts;
  settingChoice;
  carriers: string[];
  graphChoices: GraphOptions;
  _next: BehaviorSubject<number>;
  disableDisplayButton: BehaviorSubject<boolean>;

  constructor(
    private cmpntDataSrvc: ComponentDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dialogViews = DialogViews;
    this._next = new BehaviorSubject(this.dialogViews.aggrOptsView);
    this.disableDisplayButton = new BehaviorSubject(true);
    this.graphChoices = {
      /** TODO:
       * how to determine what kind of graph is selected
       * hard coding county line graph for now (for state data)
       */
      graphType: "county-line-graph",
    };
    this.carriers = ["AT&T", "T-Mobile", "Verizon", "All Carriers"];
    this.aggrOpts = {
      opts: ["Aggregate Settings", "State Data"],
    }
    this.settingChoice = DialogViews.aggrOptsView;
  }

  ngOnChanges(): void {
    switch(this.settingChoice) {
      case this.dialogViews.stateDataView:
        this.graphChoices.countySelected = "Entire State";
        break;
      default:
        break;
    }
    if (!!this.graphChoices.carrierSelected) {
      this.disableDisplayButton.next(false);
    }
  }

  cancel() {

  }
  back() {
    if (this._next.value == this.dialogViews.stateDataView) {
      this._next.next(this.dialogViews.aggrOptsView);
    }
  }
  next() {
    /** TODO:
     * how to determine what kind of graph is selected
     * hard coding county line graph for now (for state data)
     */
    console.log(this.settingChoice);
    if (this.settingChoice != this._next.value) {
      this._next.next(this.settingChoice);
    }
  }
  display() {
    if (!!this.graphChoices.carrierSelected) {
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      if (this.router.url === '/') { // home route
        this.router.navigate(['countyLineGraph'], { relativeTo: this.route });
      } else { // already at graph
        this.cmpntDataSrvc.updateGraphChoices();
      }
    }
  }
  add() {
    if (!!this.graphChoices.carrierSelected) {
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      this.graphChoices = {
        graphType: "county-line-graph",
      };
      this.disableDisplayButton.next(true);
      this._next.next(this.dialogViews.aggrOptsView);
    }
  }
}
