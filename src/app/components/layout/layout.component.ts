import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { UnSubscribeAdaptor } from '../Adaptors/UnSubscribeAdaptor';
import { MatDialog } from '@angular/material/dialog';
import { CountyLineGraphOptionsComponent } from '../graph-options/county-line-graph-options/county-line-graph-options.component';

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
export class LayoutComponent extends UnSubscribeAdaptor implements OnInit {
  graphTypeEnum;
  graphTypeSelected;
  //graphTypeOptions;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private getDataService: GetDataService,
    private compDataService: ComponentDataService,
    public dialog: MatDialog
  ) {
    super();
    this.graphTypeEnum = GraphTypeEnum;
    this.graphTypeSelected = this.graphTypeEnum.barGraph;
    //this.graphTypeOptions = ['barGraph', 'lineGraph'];
  }

  ngOnInit(): void {
    /**
     * TODO: Should I not get data until getting to graph view
     */
    this.sub.sink = this.getDataService.roundData.subscribe({
      next: (data) => {
        this.compDataService.roundData = data;
      },
      error: (err) => {
        console.error('something wrong occurred: ' + err);
      },
      complete: () => {
        // console.log('done');
      }
    });
  }

  goHome(): void {
    this.router.navigate([''], { relativeTo: this.route });
  }

  onChange(event: any): void {
    this.graphTypeSelected = event.value;
    if (this.graphTypeSelected === this.graphTypeEnum.barGraph) {
      this.compDataService.updateGraphType('bar-graph');
      this.goHome();
    } else if (this.graphTypeSelected === this.graphTypeEnum.lineGraph) {
      this.compDataService.updateGraphType('line-graph');
      this.goHome();
    } else {
      this.compDataService.updateGraphType('county-line-graph');
      this.goHome();
    }
  }

  openCountyDialog() {
    const dialogRef = this.dialog.open(CountyLineGraphOptionsComponent);

    /** TODO: should i add this to subsink? */
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
