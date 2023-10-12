import { Component } from '@angular/core';
import { GraphOptions } from '../GraphOptionsModels/GraphOptions';
import { Counties } from '../GraphOptionsModels/Counties';
import { BehaviorSubject } from 'rxjs';
import { OptionsDialog } from '../OptionsDialogInterface/OptionsDialog';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-county-line-graph-options',
  templateUrl: './county-line-graph-options.component.html',
  styleUrls: ['./county-line-graph-options.component.css']
})

export class CountyLineGraphOptionsComponent implements OptionsDialog {
  graphChoices: GraphOptions;
  counties: any[];
  _next: BehaviorSubject<boolean>;

  constructor(private cmpntDataSrvc: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router) {
    this.counties = Counties;
    this.graphChoices = {
      graphType: "county-line-graph",
      carriers: ["AT&T", "T-Mobile", "Verizon"]
    };
    this._next = new BehaviorSubject(false);
  }
  cancel() {
    this.cmpntDataSrvc.clearGraphChoices();
  }

  back() {
    this._next.next(false);
  }

  next() {
    this._next.next(!!this.graphChoices.countySelected!);
  }

  display() {
    if (!!this.graphChoices.carrierSelected) {
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      this.router.navigate(['countyLineGraph'], { relativeTo: this.route });
    }
  }

  add() {
    if (!!this.graphChoices.carrierSelected) {
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      this.graphChoices = {
        graphType: "county-line-graph",
        carriers: ["AT&T", "T-Mobile", "Verizon"]
      };
      this._next.next(false);
    }
  }

}
