import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { GraphService } from 'src/app/services/graph/graph.service';
import { UnSubscribeAdaptor } from '../Adaptors/UnSubscribeAdaptor';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent extends UnSubscribeAdaptor implements OnInit {
  lineChartData: ChartConfiguration<'line'>['data'];
  lineChartOptions: ChartOptions<'line'>;
  lineChartLegend;

  constructor(
    private graphService: GraphService,
    private getDataService: GetDataService,
    private compDataService: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router
    ) {
      super();
      this.lineChartOptions = {
        responsive: true
      };
      this.lineChartLegend = true;
  }

  ngOnInit() {
    this.sub.sink = this.getDataService.getGraphParams().subscribe(
      {
        next: (result) => {
          if (!result.comparison) {
            this.lineChartData = this.graphService.getSingleLineGraph(result, this.compDataService.round_data);
          } else {
            this.lineChartData = this.graphService.comparisonLineGraph(result, this.compDataService.round_data);
          }
        },
        error: (err) => {
          this.router.navigate([''], { relativeTo: this.route });
          console.log("Error caught at Subscriber Graph Component: " + err)
        },
      }
    );
  }

}
