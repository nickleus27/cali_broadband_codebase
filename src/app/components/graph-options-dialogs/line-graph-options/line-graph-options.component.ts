import { Component, OnChanges } from '@angular/core';
import { OptionsDialog } from '../OptionsDialogInterface/OptionsDialog';
import { GraphOptions } from '../GraphOptionsModels/GraphOptions';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { ActivatedRoute, Router } from '@angular/router';

export enum DialogViews {
  carrierView,
  speedRange
};

@Component({
  selector: 'app-line-graph-options',
  templateUrl: './line-graph-options.component.html',
  styleUrls: ['./line-graph-options.component.css']
})
export class LineGraphOptionsComponent implements OptionsDialog, OnChanges {
  dialogViews = DialogViews;
  graphChoices: GraphOptions;
  carriers: string[];
  speedRanges: string[];
  _next: BehaviorSubject<number>;
  disableDisplayButton: BehaviorSubject<boolean>;


  constructor(private cmpntDataSrvc: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router) {
    this.graphChoices = {
      graphType: "line-graph",
    };
    this.carriers = [
      'AT&T',
      'FirstNet',
      'Sprint',
      'T-Mobile',
      'Verizon'
    ];
    this.speedRanges = ["N/A", "0-10 Mbps", "10-50 Mbps", "50-100 Mbps", "100-200 Mbps", "200+ Mbps"];

    this._next = new BehaviorSubject(this.dialogViews.carrierView);
    this.disableDisplayButton = new BehaviorSubject(true);
  }

  ngOnChanges() {
    if (!!this.graphChoices.speedRangeSelected) {
      this.disableDisplayButton.next(false);
    }
  }

  cancel() {
    // this.cmpntDataSrvc.clearGraphChoices();
  }

  back() {
    if (this._next.value == this.dialogViews.speedRange) {
      this._next.next(this.dialogViews.carrierView);
    }
  }

  next() {
    if (this._next.value == this.dialogViews.carrierView && !!this.graphChoices.carrierSelected) {
      this._next.next(this.dialogViews.speedRange);
    }
  }

  add() {
    if (!!this.graphChoices.speedRangeSelected) {
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      this.graphChoices = {
        graphType: "line-graph",
      };
      this.disableDisplayButton.next(true);
      this._next.next(this.dialogViews.carrierView);
    }
  }

  display() {
    if (!!this.graphChoices.speedRangeSelected) {
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      if (this.router.url === '/') { // home route
        this.router.navigate(['lineGraphs'], { relativeTo: this.route });
      } else { // already at graph
        this.cmpntDataSrvc.updateGraphChoices();
      }
    }
  }

}
