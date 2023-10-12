import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { UnSubscribeAdaptor } from '../Adaptors/UnSubscribeAdaptor';
import { MatDialog } from '@angular/material/dialog';
import { CountyLineGraphOptionsComponent } from '../graph-options/county-line-graph-options/county-line-graph-options.component';
import { GraphOptions } from '../graph-options/GraphOptionsModels/GraphOptions';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent extends UnSubscribeAdaptor {
  // graphType: string;
  graphChoices: GraphOptions[];

  constructor(
    public compDataService: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {
    super();
    // this.sub.sink = this.compDataService.displayButtonFlag.subscribe(flag => this.buttonIsDisabled = flag);
    // this.sub.sink = this.compDataService.displayCompButtonFlag.subscribe(flag => this.compButtonDisabled = flag);
    // this.sub.sink = this.compDataService.graphType.subscribe(flag => this.graphType = flag);
  }


  // goToGraphs() {
  //   if (this.graphType == 'bar-graph') {
  //     this.router.navigate(['graphs'], { relativeTo: this.route });
  //   } else if (this.graphType == 'line-graph') {
  //     this.router.navigate(['lineGraphs'], { relativeTo: this.route });
  //   } else {
  //     this.router.navigate(['countyLineGraph'], { relativeTo: this.route });
  //   }
  // }

  // comparison() {
  //   this.compDataService.updateGraphButtonFlag(true);
  //   this.compDataService.updateCompButtonFlag(true);
  //   this.compDataService.updateSideNavComp(true);
  // }

  // resetSideNav() {
  //   this.compDataService.reset_opts();
  // }

  openCountyDialog() {
    this.dialog.open(CountyLineGraphOptionsComponent,
      {
        width: '75%',
        // height: '65%',
      });
  }
}
