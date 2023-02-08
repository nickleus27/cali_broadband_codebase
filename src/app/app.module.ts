import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LayoutComponent } from './components/layout/layout.component';
import {MatButtonModule} from '@angular/material/button';
import { GraphComponent } from './components/graph/graph.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';
import { NgToastModule } from 'ng-angular-popup';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LayoutComponent,
    GraphComponent,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    MatRadioModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    NgToastModule
  ],
  providers: [ { provide: NgChartsConfiguration, useValue: { generateColors: false }}],
  bootstrap: [AppComponent]
})
export class AppModule { }
