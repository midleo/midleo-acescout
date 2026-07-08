import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainContentComponent } from './components/main/main.component';
import { ACEServerComponent } from './components/serverinfo/serverinfo.component';
import { ACEServerListComponent } from './components/serverlist/serverlist.component';

const routes: Routes = [
  {
    path:  '',
    component:  MainContentComponent
  },
  {
    path:  'showServer/:id',
    component:  ACEServerListComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path:  'showINTServer/:id',
    component:  ACEServerComponent,
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
