import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { GraphService } from 'src/app/services/graph/graph.service';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements OnInit {
  lineChartData: ChartConfiguration<'line'>['data'];
  lineChartOptions: ChartOptions<'line'>;
  lineChartLegend;
  dataSubscription: any;

  constructor(
    private graphService: GraphService,
    private getDataService: GetDataService,
    private compDataService: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.lineChartOptions = {
      responsive: true
    };
    this.lineChartLegend = true;
  }

  ngOnInit() {
    this.dataSubscription = this.getDataService.getGraphParams().subscribe(
      {
        next: (result) => {
          this.lineChartData = this.graphService.getSingleLineGraph(result, this.compDataService.round_data);
        },
        error: (err) => {
          this.router.navigate([''], { relativeTo: this.route });
          console.log("Error caught at Subscriber Graph Component: " + err)
        },
      }
    );
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
