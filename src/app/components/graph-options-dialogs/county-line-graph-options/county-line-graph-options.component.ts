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
    if (this._next.value == this.dialogViews.carrierView) {
      this._next.next(this.dialogViews.countyView);
    }
  }

  next() {
    if (this._next.value == this.dialogViews.countyView && !!this.graphChoices.countySelected) {
      this._next.next(this.dialogViews.carrierView);
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
