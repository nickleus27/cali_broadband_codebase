import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData, ChartTypeRegistry, TooltipItem } from 'chart.js';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { GraphService } from 'src/app/services/graph/graph.service';
import { GraphAdaptor } from '../Adaptors/GraphAdaptor';
import { ThemeService } from 'src/app/services/theme-service/theme.service';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent extends GraphAdaptor<'line'> implements OnInit {
  lineChartData: ChartData<'line'>;
  lineChartLegend;

  constructor(
    private graphService: GraphService,
    private getDataService: GetDataService,
    private cmpntDataSrvc: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router,
    public override themeService: ThemeService
  ) {
    super(themeService);
    this.chartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem: TooltipItem<keyof ChartTypeRegistry>): string | void | string[] => {
              const tooltipData: any = tooltipItem.dataset.data[tooltipItem.dataIndex];
              return [
                "Speed Range: " + tooltipData.speedRange,
                tooltipItem.dataset.label + " : " + tooltipItem.formattedValue + "%"
              ];
            }
          }
        }
      },
    };
    this.lineChartLegend = true;
  }

  ngOnInit() {
    this.sub.sink = this.cmpntDataSrvc.graphChoicesObsrv.subscribe({
      next: (graphChoices) => {
        this.getDataService.roundData.subscribe({
          next: (data) => {
            try {
              this.lineChartData = this.graphService.lineGraph(graphChoices, data);
            } catch (e) {
              //console.log(e);
              // TODO
              this.router.navigate([''], { relativeTo: this.route });
            }
          },
          error: (err) => {
            // TODO
            this.router.navigate([''], { relativeTo: this.route });
            console.log("Error caught for roundData at subscriber Line Graph Component: " + err);
          },
          complete: () => { }
        });
      },
      error: (err) => {
        // TODO
        this.router.navigate([''], { relativeTo: this.route });
        console.log("Error caught for graphChoicesObsrv at subscriber Line Graph Component: " + err);
      },
      complete: () => { }
    });
    this.cmpntDataSrvc.updateGraphChoices();
  }

}
