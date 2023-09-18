import { Component, OnInit } from '@angular/core';
import { UnSubscribeAdaptor } from '../Adaptors/UnSubscribeAdaptor';
import { ChartConfiguration, ChartOptions, ChartTypeRegistry, TooltipItem, TooltipModel } from 'chart.js';
import { GraphService } from 'src/app/services/graph/graph.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';

@Component({
  selector: 'app-line-county-graph',
  templateUrl: './line-county-graph.component.html',
  styleUrls: ['./line-county-graph.component.css']
})
export class LineCountyGraphComponent extends UnSubscribeAdaptor implements OnInit {
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
                label: function(this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>) {
                    return tooltipItem.dataset.label + " : " + tooltipItem.formattedValue + "%";
                }
            }
          }
        },
      };
      this.lineChartLegend = true;
  }

  ngOnInit() {
    /**
     * TODO: need to set up data for county line graph to use
     */
    
    // this.sub.sink = this.getDataService.graphParams.subscribe(
    //   {
    //     next: (result) => {
    //       if (!result.comparison) {
    //         this.lineChartData = this.graphService.getSingleLineGraph(result, this.compDataService.roundData);
    //       } else {
    //         this.lineChartData = this.graphService.comparisonLineGraph(result, this.compDataService.roundData);
    //       }
    //     },
    //     error: (err) => {
    //       this.router.navigate([''], { relativeTo: this.route });
    //       console.log("Error caught at Subscriber Graph Component: " + err)
    //     },
    //   }
    // );
  }

}
