import { Component, OnInit } from '@angular/core';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { ChartData, ChartType, ChartTypeRegistry, TooltipItem, TooltipModel } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { GraphService } from 'src/app/services/graph/graph.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GraphAdaptor } from '../Adaptors/GraphAdaptor';
import { ThemeService } from 'src/app/services/theme-service/theme.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent extends GraphAdaptor<'bar'> implements OnInit {
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];
  public barChartData: ChartData<'bar'>;

  constructor(
    private dataService: GetDataService,
    private graphService: GraphService,
    private cmpntDataSrvc: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router,
    public override themeService: ThemeService
  ) {
    super(themeService);
    this.chartOptions = {
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
            label: function (this: TooltipModel<keyof ChartTypeRegistry>, tooltipItem: TooltipItem<keyof ChartTypeRegistry>) {
              return tooltipItem.dataset.label + " : " + tooltipItem.formattedValue + "%";
            }
          }
        },
      },
    };
  }

  ngOnInit(): void {
    /**
     * TODO: finish function
     * && create an observable to subscribe to for graphChoices
     */
    this.sub.sink = this.cmpntDataSrvc.graphChoicesObsrv.subscribe({
      next: (graphChoices) => {
        this.dataService.roundData.subscribe({
          next: (data) => {
            try {
              this.barChartData = this.graphService.barGraph(graphChoices, data);
            } catch (e) {
              console.log(e);
              // TODO
              this.router.navigate([''], { relativeTo: this.route });
            }
          },
          error: (err) => {
            /**
             * TODO: Make error handling component
             */
            this.router.navigate([''], { relativeTo: this.route });
            console.log("Error caught for roundData subscriber at Graph Component: " + err)
          },
          complete: () => { }
        });
      },
      error: (err) => {
        /**
         * TODO: Make error handling component
         */
        this.router.navigate([''], { relativeTo: this.route });
        console.log("Error for graphChoicesObsrv subscriber caught at Graph Component: " + err)
      },
      complete: () => { }
    });
    this.cmpntDataSrvc.updateGraphChoices();
  }
}
