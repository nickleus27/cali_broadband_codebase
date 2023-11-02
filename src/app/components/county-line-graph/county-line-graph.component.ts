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
              const phone = !!this.cmpntDataSrvc.getModelMapValue(tooltipData.phone) ? this.cmpntDataSrvc.getModelMapValue(tooltipData.phone) : 'All Phones';
              return [
                tooltipItem.dataset.label!,
                "Average Download Speed : " + tooltipItem.formattedValue + " kbps",
                "Phone : " + phone,
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
    this.sub.sink = this.cmpntDataSrvc.graphChoicesObsrv.subscribe({
      next: (graphChoices) => {
        this.getDataService.countyData.subscribe({
          next: (data) => {
            try {
              this.lineChartData = this.graphService.countyLineGraph(graphChoices, data);
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
            console.log("Error for countyData subscriber caught at County Line Graph Component: " + err)
          },
          complete: () => { }
        });
      },
      error: (err) => {
        /**
         * TODO: Make error handling component
         */
        this.router.navigate([''], { relativeTo: this.route });
        console.log("Error for graphChoicesObsrv subscriber caught at County Line Graph Component: " + err)
      },
      complete: () => { }
    });
    this.cmpntDataSrvc.updateGraphChoices();
  }
}
