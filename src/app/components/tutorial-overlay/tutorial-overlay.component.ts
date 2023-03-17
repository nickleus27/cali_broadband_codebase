import { Component } from '@angular/core';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { step0 } from './ModalConfig';

@Component({
  selector: 'app-tutorial-overlay',
  templateUrl: './tutorial-overlay.component.html',
  styleUrls: ['./tutorial-overlay.component.css']
})
export class TutorialOverlayComponent {
  message: string;
  yes: string;
  cancel: string;

  constructor(private compDataService: ComponentDataService) {
    if (!this.compDataService.modalState) {
      this.message = step0.message;
      this.yes = step0.yes;
      this.cancel = step0.cancel;
    }
  }


  overlay_close() {
    this.compDataService.overlay_close();
  }

}
