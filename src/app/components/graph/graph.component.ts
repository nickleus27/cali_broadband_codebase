import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { GraphService } from 'src/app/services/graph/graph.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit{

  params: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'];
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'>;

  roundData: {[key:string]: any};

  constructor(
    private dataService: GetDataService,
    private compDataService: ComponentDataService,
    private graphService: GraphService
    ) {
      console.log("graph constructor");
      this.compDataService.updateSideNavFlag(false);
      this.barChartOptions = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
          x: {},
          y: {
            min: 10
          }
        },
        plugins: {
          legend: {
            display: true,
          },
          datalabels: {
            anchor: 'end',
            align: 'end'
          }
        }
      };
      this.dataService.getGraphParams()
    .pipe(
      switchMap((params) => 
    {
      this.params = params;
      return this.dataService.getRound(this.params.option1.round.toLowerCase());
    })).subscribe((result) => 
    {
      this.roundData = result;
      if (this.params.option1.test === 'Speeds') {
        this.barChartData = this.graphService.getSpeedGraph(
          this.roundData[this.params.option1.carrier][this.params.option1.phone][this.params.option1.server]);
      } else {
        this.barChartData = this.graphService.getErrorGraph(
          this.roundData[this.params.option1.carrier][this.params.option1.phone][this.params.option1.server]);
      }
    });
  }

  ngOnInit(): void {
    console.log("graph ngoninit");
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40 ];

    this.chart?.update();
  }
}
