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
    
  }

}
