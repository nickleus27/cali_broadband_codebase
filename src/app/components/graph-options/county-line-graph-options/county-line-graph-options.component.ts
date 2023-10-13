import { Component, OnChanges } from '@angular/core';
import { GraphOptions } from '../GraphOptionsModels/GraphOptions';
import { Counties } from '../GraphOptionsModels/Counties';
import { BehaviorSubject } from 'rxjs';
import { OptionsDialog } from '../OptionsDialogInterface/OptionsDialog';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { ActivatedRoute, Router } from '@angular/router';

export enum DialogViews {
  countyView,
  carrierView
};

@Component({
  selector: 'app-county-line-graph-options',
  templateUrl: './county-line-graph-options.component.html',
  styleUrls: ['./county-line-graph-options.component.css']
})

export class CountyLineGraphOptionsComponent implements OptionsDialog, OnChanges {
  dialogViews = DialogViews;
  graphChoices: GraphOptions;
  counties: any[];
  _next: BehaviorSubject<number>;
  disableDisplayButton: BehaviorSubject<boolean>;
  carriers: string[];


  constructor(private cmpntDataSrvc: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router) {
    this.counties = Counties;
    this.graphChoices = {
      graphType: "county-line-graph",
    };
    this.carriers = ["AT&T", "T-Mobile", "Verizon"];
    this._next = new BehaviorSubject(this.dialogViews.countyView);
    this.disableDisplayButton = new BehaviorSubject(true);
  }

  ngOnChanges() {
    if (!!this.graphChoices.carrierSelected) {
      this.disableDisplayButton.next(false);
    }
  }

  cancel() {
    this.cmpntDataSrvc.clearGraphChoices();
  }

  back() {
    /**
     * This switch statement is just an example for a dialogs that has multiple
     * views to travel back and forth between. After using this example for
     * dialogs that need it, this can be refactored.
     */
    switch (this._next.value) {
      case this.dialogViews.countyView:
        this._next.next(this.dialogViews.countyView);
        break;
      case this.dialogViews.carrierView:
        this._next.next(this.dialogViews.countyView);
        break;
      default:
        console.log("Malformed dialog view value");
        break;
    }
  }

  next() {
    /**
     * This switch statement is just an example for a dialogs that has multiple
     * views to travel back and forth between. After using this example for
     * dialogs that need it, this can be refactored.
     */
    switch (this._next.value) {
      case this.dialogViews.countyView:
        if (!!this.graphChoices.countySelected) {
          this._next.next(this.dialogViews.carrierView);
        }
        break;
      default:
        console.log("Malformed dialog view value");
        break;
    }
  }

  add() {
    if (!!this.graphChoices.carrierSelected) {
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      this.graphChoices = {
        graphType: "county-line-graph",
      };
      this.disableDisplayButton.next(true);
      this._next.next(this.dialogViews.countyView);
    }
  }

  display() {
    if (!!this.graphChoices.carrierSelected) {
      console.log(this.dialogViews);
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      this.router.navigate(['countyLineGraph'], { relativeTo: this.route });
    }
  }

}
