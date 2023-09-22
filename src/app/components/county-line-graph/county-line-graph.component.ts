import { Component, OnInit } from '@angular/core';
import { UnSubscribeAdaptor } from '../Adaptors/UnSubscribeAdaptor';
import { ChartConfiguration, ChartOptions, ChartTypeRegistry, TooltipItem, TooltipModel } from 'chart.js';
import { GraphService } from 'src/app/services/graph/graph.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';

@Component({
  selector: 'app-county-line-graph',
  templateUrl: './county-line-graph.component.html',
  styleUrls: ['./county-line-graph.component.css']
})
export class CountyLineGraphComponent extends UnSubscribeAdaptor implements OnInit {
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
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>): string | void | string[] {
              return [tooltipItem.dataset.label!, "Average Download Speed : " + tooltipItem.formattedValue + " kbps"];
            }
          }
        }
      },
    };
    this.lineChartLegend = true;
  }

  ngOnInit() {
    this.sub.sink = this.getDataService.graphParams.subscribe({
      next: (options) => {
        try {
          this.lineChartData = this.graphService.countyLineGraph(options, this.compDataService.roundData, options.comparison);
        } catch (e) {
          //console.log(e);
          this.router.navigate([''], { relativeTo: this.route });
        }
      },
      error: (err) => {
        this.router.navigate([''], { relativeTo: this.route });
        console.log("Error caught at Subscriber Graph Component: " + err)
      },
      complete: () => { }
    });
  }

}
