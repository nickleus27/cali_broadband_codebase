import { Component } from '@angular/core';
import { GetDataService } from 'src/app/services/get-data/get-data.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

  round14: any;

  constructor(dataService: GetDataService) {
    dataService.getRound('round14.csv')
      .subscribe((result) => {
        this.round14 = JSON.stringify(result, null, 2);
      });
  }
}
