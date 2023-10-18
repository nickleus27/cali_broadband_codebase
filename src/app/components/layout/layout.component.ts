import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { DeleteChoiceDialogComponent } from '../toolbar-components/delete-choice-dialog/delete-choice-dialog.component';

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
    private cmpntDataSrvc: ComponentDataService
  ) {
    this.graphTypeEnum = GraphTypeEnum;
    this.graphTypeSelected = this.graphTypeEnum.barGraph;
    //this.graphTypeOptions = ['barGraph', 'lineGraph'];
  }

  ngOnInit(): void {}

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

  onChange(event: any): void {
  //   this.graphTypeSelected = event.value;
  //   if (this.graphTypeSelected === this.graphTypeEnum.barGraph) {
  //     this.compDataService.updateGraphType('bar-graph');
  //     this.goHome();
  //   } else if (this.graphTypeSelected === this.graphTypeEnum.lineGraph) {
  //     this.compDataService.updateGraphType('line-graph');
  //     this.goHome();
  //   } else {
  //     this.compDataService.updateGraphType('county-line-graph');
  //     this.goHome();
  //   }
  }

}
