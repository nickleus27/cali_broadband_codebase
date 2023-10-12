import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartOptions, ChartTypeRegistry, TooltipItem, TooltipModel } from 'chart.js';
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
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>) {
              return tooltipItem.dataset.label + " : " + tooltipItem.formattedValue + "%";
            }
          }
        }
      },
    };
    this.lineChartLegend = true;
  }

  ngOnInit() {
    // this.sub.sink = this.getDataService.graphParams.subscribe(
    //   {
    //     next: (result) => {
    //       try {
    //         if (!result.comparison) {
    //           this.lineChartData = this.graphService.getSingleLineGraph(result, this.compDataService.roundData);
    //         } else {
    //           this.lineChartData = this.graphService.comparisonLineGraph(result, this.compDataService.roundData);
    //         }
    //       } catch (e) {
    //         //console.log(e);
    //         this.router.navigate([''], { relativeTo: this.route });
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
