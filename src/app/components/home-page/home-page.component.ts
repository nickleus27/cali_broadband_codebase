import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { UnSubscribeAdaptor } from '../Adaptors/UnSubscribeAdaptor';
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { TutorialOverlayComponent } from '../tutorial-overlay/tutorial-overlay.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent extends UnSubscribeAdaptor implements OnInit {
  buttonIsDisabled: boolean;
  compButtonDisabled: boolean;
  isBarGraph: boolean;
  overlayRef: OverlayRef;

  constructor(
    private compDataService: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay
  ) {
    super();
    this.sub.sink = this.compDataService.displayButtonFlag.subscribe(flag => this.buttonIsDisabled = flag);
    this.sub.sink = this.compDataService.displayCompButtonFlag.subscribe(flag => this.compButtonDisabled = flag);
    this.sub.sink = this.compDataService.isBarGraph.subscribe(flag => this.isBarGraph = flag);
  }

  ngOnInit(): void {
    this.overlay_open();
  }

  goToGraphs() {
    if (this.isBarGraph) {
      this.router.navigate(['graphs'], { relativeTo: this.route });
    } else {
      this.router.navigate(['lineGraphs'], { relativeTo: this.route });
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

  overlay_open() {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
    // We create the overlay
    this.overlayRef = this.overlay.create({
      positionStrategy: positionStrategy
    });
    //Then we create a portal to render a component
    const componentPortal = new ComponentPortal(TutorialOverlayComponent);
    // We add a custom CSS class to our overlay
    //this.overlayRef.addPanelClass("flexbox-container");
    //We render the portal in the overlay
    this.overlayRef.attach(componentPortal);
  }
}
