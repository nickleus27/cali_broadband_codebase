import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { UnSubscribeAdaptor } from '../Adaptors/UnSubscribeAdaptor';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent extends UnSubscribeAdaptor {
  buttonIsDisabled: boolean;
  compButtonDisabled: boolean;
  graphType: string;

  constructor(
    private compDataService: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.sub.sink = this.compDataService.displayButtonFlag.subscribe(flag => this.buttonIsDisabled = flag);
    this.sub.sink = this.compDataService.displayCompButtonFlag.subscribe(flag => this.compButtonDisabled = flag);
    this.sub.sink = this.compDataService.graphType.subscribe(flag => this.graphType = flag);
  }

  goToGraphs() {
    if (this.graphType == 'bar-graph') {
      this.router.navigate(['graphs'], { relativeTo: this.route });
    } else if (this.graphType == 'line-graph') {
      this.router.navigate(['lineGraphs'], { relativeTo: this.route });
    } else {
      this.router.navigate(['lineCountyGraphs'], { relativeTo: this.route });
    }
  }

  comparison() {
    this.compDataService.updateGraphButtonFlag(true);
    this.compDataService.updateCompButtonFlag(true);
    this.compDataService.updateSideNavComp(true);
  }

  resetSideNav() {
    this.compDataService.reset_opts();
  }
}
