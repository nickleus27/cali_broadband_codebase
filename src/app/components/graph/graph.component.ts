import { Component, OnInit, ViewChild } from '@angular/core';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, ChartTypeRegistry, TooltipItem, TooltipModel } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { GraphService } from 'src/app/services/graph/graph.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { UnSubscribeAdaptor } from '../Adaptors/UnSubscribeAdaptor';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent extends UnSubscribeAdaptor implements OnInit {

  params: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'];
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'>;

  constructor(
    private dataService: GetDataService,
    private graphService: GraphService,
    private compDataService: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {
          min: 0
        }
      },
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          anchor: 'end',
          align: 'end'
        },
        tooltip: {
          callbacks: {
              label: function(this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>) {
                return tooltipItem.dataset.label + " : " + tooltipItem.formattedValue + "%";
              }
          }
        },
      },
    };
  }

  ngOnInit(): void {
    this.sub.sink = this.dataService.getGraphParams()
      .subscribe(
        {
          next: (params) => {
            this.params = params;
            const roundData = this.compDataService.round_data[this.params.graph1.roundSelected];
            if (!this.params.comparison) { //load graph for single phone carrier
              let keys = Object.keys(roundData[this.params.graph1.carrierSelected]);
              if (!keys.includes(this.params.graph1.phoneSelected)) { //update phone selection if old phone is not in carrier phone set
                this.compDataService.updatePhoneFlag(keys[0]);
                return;
              }
              this.barChartData = this.graphService.getSingleGraph(this.params);
            } else {
              this.barChartData = this.graphService.comparisonGraph(this.params);
            }
          },
          error: (err) => {
            this.router.navigate([''], { relativeTo: this.route });
            console.log("Error caught at Subscriber Graph Component: " + err)
          },
        }
      );
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    //console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    //console.log(event, active);
  }
}
