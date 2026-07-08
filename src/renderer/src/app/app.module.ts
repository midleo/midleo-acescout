import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from './material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogContentiibdialogComponent } from './app.component';
import { MainContentComponent } from './components/main/main.component';
import { ACEServerComponent } from './components/serverinfo/serverinfo.component';
import { ACEServerListComponent } from './components/serverlist/serverlist.component';
import { MenuListItemComponent, ConfirmDeleteDialogComponent } from './components/menu-list-item/menu-list-item.component';
import { NavService } from './components/menu-list-item/nav.service';
import { DataService } from './common/data.service';

@NgModule({
  declarations: [
    AppComponent,
    MainContentComponent,
    MenuListItemComponent,
    ConfirmDeleteDialogComponent,
    DialogContentiibdialogComponent,
    ACEServerComponent,
    ACEServerListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
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
  bootstrap: [AppComponent]
})
export class AppModule { }
