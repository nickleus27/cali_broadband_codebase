import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphComponent } from './components/graph/graph.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LineGraphComponent } from './components/line-graph/line-graph.component';
import { LineCountyGraphComponent } from './components/line-county-graph/line-county-graph.component';

const routes: Routes = [
  { path: 'lineCountyGraphs', component: LineCountyGraphComponent },
  { path: 'lineGraphs', component: LineGraphComponent },
  { path: 'graphs', component: GraphComponent },
  { path: '', component: HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
