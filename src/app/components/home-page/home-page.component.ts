import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  buttonIsDisabled: boolean;

  constructor(
    private compDataService: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.compDataService.displayFlag.subscribe(flag => this.buttonIsDisabled = flag);
  }

  goToGraphs(args: any) {
    console.log("clicked");
    this.router.navigate(['graphs'], { relativeTo: this.route });
  }
}
