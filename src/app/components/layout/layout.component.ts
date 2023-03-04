import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';

export enum GraphTypeEnum {
    barGraph,
    lineGraph
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  graphTypeEnum;
  graphTypeSelected;
  //graphTypeOptions;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private compDataService: ComponentDataService
  ) {
    this.graphTypeEnum = GraphTypeEnum;
    this.graphTypeSelected = this.graphTypeEnum.barGraph;
    //this.graphTypeOptions = ['barGraph', 'lineGraph'];
  }

  goHome(): void {
    this.router.navigate([''], { relativeTo: this.route });
  }

  onChange(event: any): void {
    this.graphTypeSelected = event.value;
    if (this.graphTypeSelected === this.graphTypeEnum.barGraph) {
      this.compDataService.updateIsBarGraph(true);
    } else {
      this.compDataService.updateIsBarGraph(false);
    }
  }
}
