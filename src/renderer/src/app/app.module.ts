import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogContentiibdialogComponent} from './app.component';
import { MainContentComponent } from './components/main/main.component';
import { ACEServerComponent } from './components/serverinfo/serverinfo.component';
import { ACEServerListComponent } from './components/serverlist/serverlist.component';
import { iiblistComponent, DialogDataQIDialogComponent } from './components/iibinfo/iibinfo.component';
import { MenuListItemComponent } from './components/menu-list-item/menu-list-item.component';
import { NavService } from './components/menu-list-item/nav.service';
import { DataService } from './common/data.service';


@NgModule({
  declarations: [
    AppComponent,
    MainContentComponent,
    MenuListItemComponent,
    DialogContentiibdialogComponent,
    DialogDataQIDialogComponent,
    ACEServerComponent,
    ACEServerListComponent,
    iiblistComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  exports: [
    MatDialogModule
  ],
  providers: [NavService, DataService],
  entryComponents: [ DialogContentiibdialogComponent, DialogDataQIDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
