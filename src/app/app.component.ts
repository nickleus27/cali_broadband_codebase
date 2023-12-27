import { Component, Inject, Renderer2 } from '@angular/core';
import { ThemeService } from './services/theme-service/theme.service';
import { UnSubscribeAdaptor } from './components/Adaptors/UnSubscribeAdaptor';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends UnSubscribeAdaptor {

  constructor(private themeService: ThemeService,
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2
  ) {
    super();
  }

  ngOnInit() {
    this.sub.sink = this.themeService.theme.subscribe((theme: string) => {
      console.log(theme);
      if (theme == 'dark-theme') {
        this.renderer.setStyle(this.document.body, 'background-color', '#15292B');
      } else {
        this.renderer.setStyle(this.document.body, 'background-color', '#EDEDED');
      }
    });
  }
}
