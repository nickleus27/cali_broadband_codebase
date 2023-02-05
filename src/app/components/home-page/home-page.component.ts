import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GetDataService } from 'src/app/services/get-data/get-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  buttonIsDisabled: boolean;
  params: any;

  constructor(
    private getDataService: GetDataService,
    private compDataService: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.compDataService.displayFlag.subscribe(flag => this.buttonIsDisabled = flag);
  }

  goToGraphs(args: any) {
    this.router.navigate(['graphs', JSON.stringify(this.getDataService.getGraphParams(), null, 2)], { relativeTo: this.route });
  }
}
