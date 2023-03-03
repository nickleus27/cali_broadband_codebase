import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router
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
  }
}
