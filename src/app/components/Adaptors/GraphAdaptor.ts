import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { UnSubscribeAdaptor } from './UnSubscribeAdaptor';
import { ThemeService } from 'src/app/services/theme-service/theme.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartTypeRegistry } from 'chart.js';

/* Adaptor parent class for graphs for ngAfterViewInit */
@Component({
  template: ''
})
export abstract class GraphAdaptor<TType extends keyof ChartTypeRegistry = keyof ChartTypeRegistry> extends UnSubscribeAdaptor implements AfterViewInit {
  @ViewChild(BaseChartDirective) public chart: BaseChartDirective | undefined;
  public chartOptions: ChartOptions<TType> | any;

  constructor(public themeService: ThemeService) {
    super();
  }

  ngAfterViewInit() {
    this.sub.sink = this.themeService.theme.subscribe((theme: string) => {
      console.log(theme);
      const chart = this.chart?.chart;
      if (theme == 'dark-theme') {
        if (chart && chart.options && chart.options.scales && chart.options.scales['x'] && chart.options.scales['x'].ticks)
          chart.options.scales!['x'].ticks.color = "white";
        if (chart && chart.options && chart.options.scales && chart.options.scales['y'] && chart.options.scales['y'].ticks)
          chart.options.scales!['y'].ticks.color = "white";
        if (chart && chart.options && chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels)
          chart.options.plugins.legend.labels.color = "white";
        this.chartOptions.scales = {
          x: {
            ticks: {
              color: 'white',
            }
          },
          y: {
            ticks: {
              color: 'white'
            }
          }
        }
        this.chartOptions.plugins!.legend = {
          labels: {
            color: "white"
          }
        }
      } else {
        if (chart && chart.options && chart.options.scales && chart.options.scales['x'] && chart.options.scales['x'].ticks)
          chart.options.scales!['x'].ticks.color = '#505050';
        if (chart && chart.options && chart.options.scales && chart.options.scales['y'] && chart.options.scales['y'].ticks)
          chart.options.scales!['y'].ticks.color = '#505050';
        if (chart && chart.options && chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels)
          chart.options.plugins.legend.labels.color = '#505050';
        this.chartOptions!.scales = {
          x: {
            ticks: {
              color: '#505050',
            }
          },
          y: {
            ticks: {
              color: '#505050'
            }
          }
        }
        this.chartOptions!.plugins!.legend = {
          labels: {
            color: '#505050'
          }
        }
      }
      this.chart?.update();
      console.log(this.chart);
    });
  }
}