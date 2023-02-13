import { Component, OnInit, ViewChild } from '@angular/core';
import { GetDataService } from 'src/app/services/get-data/get-data.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { GraphService } from 'src/app/services/graph/graph.service';
import { switchMap } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  params: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'];
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'>;

  roundData: { [key: string]: any };

  constructor(
    private dataService: GetDataService,
    private graphService: GraphService,
    private toast: NgToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
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
  }

  ngOnInit(): void {
    this.dataService.getGraphParams()
      .pipe(
        switchMap((params) => {
          this.params = params;
          return this.dataService.getRound(this.params.option1.round.toLowerCase());
        })).subscribe(
          {
            next: (result) => {
              this.roundData = result;
              let keys = Object.keys(this.roundData[this.params.option1.carrier]);
              if (!keys.includes(this.params.option1.phone)) {
                this.toastWarning("Missing Data", "Please select a phone model");
                return;
              }
              this.barChartData = this.graphService
                .getSingleGraph(
                  this.roundData[this.params.option1.carrier][this.params.option1.phone][this.params.option1.server]
                );
            },
            error: (err) => {
              this.router.navigate([''], { relativeTo: this.route });
              //console.log("Error caught at Subscriber Graph Component: " + err)
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

  private toastWarning(detailMsg: string, summaryMsg: string): void {
    this.toast.warning({ detail: detailMsg, summary: summaryMsg, duration: 5000 });
  }
}
