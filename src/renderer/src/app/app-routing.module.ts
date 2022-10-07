import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainContentComponent } from './components/main/main.component';
import { ACEServerComponent } from './components/serverinfo/serverinfo.component';
import { iiblistComponent } from './components/iibinfo/iibinfo.component';

const routes: Routes = [
  {
    path:  '',
    component:  MainContentComponent
  },
  {
    path:  'showServer/:id',
    component:  ACEServerComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path:  'showINTServer/:id',
    component:  iiblistComponent,
    runGuardsAndResolvers: 'always'
  }
//  { path: '404', component: NotfoundComponent },
//  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
