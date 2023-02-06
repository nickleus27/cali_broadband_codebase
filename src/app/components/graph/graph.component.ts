import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,  ParamMap} from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit{

  params: object;

  constructor(
    private dataService: GetDataService,
    private route: ActivatedRoute,
    private router: Router,
    private compDataService: ComponentDataService
    ) {
      console.log("graph constructor");
      this.compDataService.updateSideNavFlag(false);
  }

  ngOnInit(): void {
  /* TODO: change the params as an observable in get-dat service */

    this.route.paramMap.subscribe(params => {
      let paramString = params.get('graphData');
      if (paramString == null) {
        paramString = "";
      }
      this.params = JSON.parse(paramString);
      console.log(this.params);
    });
    console.log("graph ngoninit");
  }
}
