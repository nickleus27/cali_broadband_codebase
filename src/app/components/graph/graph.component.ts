import { Component } from '@angular/core';
import { ActivatedRoute, Router,  ParamMap} from '@angular/router';
import { GetDataService } from 'src/app/services/get-data/get-data.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {

  params: object;

  constructor(
    private dataService: GetDataService,
    private route: ActivatedRoute,
    private router: Router
    ) {
      this.route.paramMap.subscribe(params => {
        let paramString = params.get('graphData');
        if (paramString == null) {
          paramString = "";
        }
        this.params = JSON.parse(paramString);
        console.log(this.params);
      });
  }
}
