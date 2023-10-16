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
    private cmpntDataSrvc: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.lineChartOptions = {
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
    this.sub.sink = this.getDataService.roundData.subscribe({
      next: (data) => {
        try {
          this.lineChartData = this.graphService.lineGraph(
            this.cmpntDataSrvc.graphChoices, data);
        } catch (e) {
          //console.log(e);
          this.router.navigate([''], { relativeTo: this.route });
        }
      },
      error: (err) => {
        this.router.navigate([''], { relativeTo: this.route });
        console.log("Error caught at Subscriber County Line Graph Component: " + err)
      },
      complete: () => { }
    });
  }

}
