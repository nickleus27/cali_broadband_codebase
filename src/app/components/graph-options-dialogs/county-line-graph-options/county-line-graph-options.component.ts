import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { GraphOptions } from '../GraphOptionsModels/GraphOptions';
import { Counties } from '../GraphOptionsModels/Counties';
import { BehaviorSubject } from 'rxjs';
import { OptionsDialog } from '../OptionsDialogInterface/OptionsDialog';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  countyDataSource;
  displayedColumns: string[];
  _next: BehaviorSubject<number>;
  disableDisplayButton: BehaviorSubject<boolean>;
  carriers: string[];

  @ViewChild('paginator') paginator: MatPaginator;

  constructor(private cmpntDataSrvc: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router) {
    this.counties = Counties.map((elem, index) => {
      return { id: index, county: elem };
    });
    this.countyDataSource = new MatTableDataSource(this.counties);
    this.displayedColumns = [
      'county',
    ];
    this.graphChoices = {
      graphType: "county-line-graph",
    };
    this.carriers = ["AT&T", "T-Mobile", "Verizon", "All Carriers"];
    this._next = new BehaviorSubject(this.dialogViews.countyView);
    this.disableDisplayButton = new BehaviorSubject(true);
  }

  ngAfterViewInit() {
    this.countyDataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    if (!!this.graphChoices.carrierSelected) {
      this.disableDisplayButton.next(false);
    }
  }

  cancel() {
    // this.cmpntDataSrvc.clearGraphChoices();
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
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      if (this.router.url === '/') { // home route
        this.router.navigate(['countyLineGraph'], { relativeTo: this.route });
      } else { // already at graph
        this.cmpntDataSrvc.updateGraphChoices();
      }
    }
  }

}
