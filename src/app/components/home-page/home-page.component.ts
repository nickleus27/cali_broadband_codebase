import { Component } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { MatDialog } from '@angular/material/dialog';
import { BarGraphOptionsComponent } from '../graph-options-dialogs/bar-graph-options/bar-graph-options.component';
import { LineGraphOptionsComponent } from '../graph-options-dialogs/line-graph-options/line-graph-options.component';
import { CountyLineGraphOptionsComponent } from '../graph-options-dialogs/county-line-graph-options/county-line-graph-options.component';
import { GraphOptions } from '../graph-options-dialogs/GraphOptionsModels/GraphOptions';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  // graphType: string;
  graphChoices: GraphOptions[];

  constructor(
    public cmpntDataSrvc: ComponentDataService,
    // private route: ActivatedRoute,
    // private router: Router,
    public dialog: MatDialog
  ) { }

  openBarGraphDialog() {
    this.cmpntDataSrvc.clearGraphChoices();
    this.dialog.open(BarGraphOptionsComponent,
      {
        width: '75%',
        // height: '65%',
      });
  }

  openLineGraphDialog() {
    this.cmpntDataSrvc.clearGraphChoices();
    this.dialog.open(LineGraphOptionsComponent,
      {
        width: '75%',
        // height: '65%',
      });
  }

  openCountyDialog() {
    this.cmpntDataSrvc.clearGraphChoices();
    this.dialog.open(CountyLineGraphOptionsComponent,
      {
        width: '75%',
        // height: '65%',
      });
  }

}
