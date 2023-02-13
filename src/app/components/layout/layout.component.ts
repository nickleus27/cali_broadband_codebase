import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  goHome(): void {
    this.router.navigate([''], { relativeTo: this.route });
  }
}
