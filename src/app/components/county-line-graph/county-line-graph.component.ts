import { Component, OnInit } from '@angular/core';
import { UnSubscribeAdaptor } from '../Adaptors/UnSubscribeAdaptor';
import { ChartConfiguration, ChartOptions, ChartTypeRegistry, TooltipItem } from 'chart.js';
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
              const tooltipData: any = tooltipItem.dataset.data[tooltipItem.dataIndex]
              return [
                tooltipItem.dataset.label!,
                "Average Download Speed : " + tooltipItem.formattedValue + " kbps",
                "Phone : " + this.cmpntDataSrvc.getModelMapValue(tooltipData.phone),
                "Number of Tests : " + tooltipData.tests
              ];
            }
          }
        }
      },
    };
    this.lineChartLegend = true;
  }

  ngOnInit() {
    this.sub.sink = this.getDataService.countyData.subscribe({
      next: (data) => {
        try {
          this.lineChartData = this.graphService.countyLineGraph(
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
