import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { DeleteChoiceDialogComponent } from '../toolbar-components/delete-choice-dialog/delete-choice-dialog.component';
import { BarGraphOptionsComponent } from '../graph-options-dialogs/bar-graph-options/bar-graph-options.component';
import { LineGraphOptionsComponent } from '../graph-options-dialogs/line-graph-options/line-graph-options.component';
import { CountyLineGraphOptionsComponent } from '../graph-options-dialogs/county-line-graph-options/county-line-graph-options.component';

export enum GraphTypeEnum {
  barGraph,
  lineGraph,
  lineCountyGraph
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  graphTypeEnum;
  graphTypeSelected;
  //graphTypeOptions;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private compDataService: ComponentDataService,
    public dialog: MatDialog,
    public cmpntDataSrvc: ComponentDataService
  ) {
    this.graphTypeEnum = GraphTypeEnum;
    this.graphTypeSelected = this.graphTypeEnum.barGraph;
    //this.graphTypeOptions = ['barGraph', 'lineGraph'];
  }

  ngOnInit(): void { }

  goHome(): void {
    this.router.navigate([''], { relativeTo: this.route });
  }

  deleteItemsDialog() {
    this.dialog.open(DeleteChoiceDialogComponent,
      {
        width: '75%',
        // height: '65%',
      });
  }
  addItemsDialog() {
    const type = this.cmpntDataSrvc.graphChoices.length ? this.cmpntDataSrvc.graphChoices[0].graphType : null;
    if (!type) {
      return;
    }
    switch (type) {
      case 'bar-graph':
        this.dialog.open(BarGraphOptionsComponent,
          {
            width: '75%',
            // height: '65%',
          });
        break;
      case 'line-graph':
        this.dialog.open(LineGraphOptionsComponent,
          {
            width: '75%',
            // height: '65%',
          });
        break;
      case 'county-line-graph':
        this.dialog.open(CountyLineGraphOptionsComponent,
          {
            width: '75%',
            // height: '65%',
          });
        break;
      default:
        console.log("Malformed Graph Type");
        // TODO: error component
        break;
    }
  }

  displayGraph() {
    const type = this.cmpntDataSrvc.graphChoices.length ? this.cmpntDataSrvc.graphChoices[0].graphType : null;
    if (!type) {
      return;
    }
    switch (type) {
      case 'bar-graph':
        this.router.navigate(['graphs'], { relativeTo: this.route });
        break;
      case 'line-graph':
        this.router.navigate(['lineGraphs'], { relativeTo: this.route });
        break;
      case 'county-line-graph':
        this.router.navigate(['countyLineGraph'], { relativeTo: this.route });
        break;
      default:
        console.log("Malformed Graph Type");
        // TODO: error component
        break;
    }
  }

}
