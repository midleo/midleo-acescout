import { Component, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy, AfterViewInit, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaMatcher } from '@angular/cdk/layout';
import { OverlayContainer} from '@angular/cdk/overlay';
// import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http';
import { NavService } from './components/menu-list-item/nav.service';
import { FormControl, FormGroup, Validators, FormBuilder, NgForm} from '@angular/forms';
import { DataService } from './common/data.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-iibdialog-dialog',
  templateUrl: './components/iibdialog/iibdialog-dialog.html',
  styleUrls: ['./components/iibdialog/iibdialog-dialog.css']
})
export class DialogContentiibdialogComponent implements OnInit {
  aceForm: FormGroup;
  objectKeys = Object.keys;

  constructor(private _dialog: MatDialog, public dataServ: DataService, private snackBar: MatSnackBar, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.aceForm = new FormGroup({
     group: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]),
     hostname: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
     port: new FormControl('', [Validators.required]),
     auth: new FormControl(''),
     usrname: new FormControl(''),
     usrpass: new FormControl(''),
     ssl: new FormControl(''),
     sslkey: new FormControl(''),
     sslpass: new FormControl(''),
     sslcipher: new FormControl('')
    }, { updateOn: 'blur' });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.aceForm.controls[controlName].hasError(errorName);
  }
  createQM() {
    if (this.aceForm.valid) {
    const qmgrinfo = {
      iconName: 'more_vert',
      name: this.aceForm.value.hostname.toUpperCase( ),
      hostname: this.aceForm.value.hostname,
      port: this.aceForm.value.port,
      auth: this.aceForm.value.auth,
      usrname: this.aceForm.value.usrname,
      usrpass: this.aceForm.value.usrpass !== '' ? (window.btoa(this.aceForm.value.usrpass)).replace(new RegExp( '=', 'g'), '') : '',
      ssl: this.aceForm.value.ssl,
      sslkey: this.aceForm.value.sslkey !== '' ? (window.btoa(this.aceForm.value.sslkey)).replace(new RegExp( '=', 'g'), '') : '',
      sslpass: this.aceForm.value.sslpass,
      sslcipher: this.aceForm.value.sslcipher,
      children: [
        { name: 'Server Info', iconName: 'devices_other', route: 'showServer'    },
        { name: 'INT Server',  iconName: 'devices_other', route: 'showINTServer'  },
        { name: 'Delete',      iconName: 'close',         route: 'deleteACE'    }
      ]
     };
    if (this.dataServ.arrACE && this.dataServ.arrACE.some(e => e.name === this.aceForm.value.group.toUpperCase( ))) {
      this.dataServ.arrACE.find(e => e.name === this.aceForm.value.group.toUpperCase( )).children.push(qmgrinfo);
    } else {
      if (Array.isArray(this.dataServ.arrACE)) {
        this.dataServ.arrACE.push({
          name: this.aceForm.value.group.toUpperCase( ),
          iconName: 'apps',
          children: [qmgrinfo]
         });
      } else {
        this.dataServ.arrACE = [{
          name: this.aceForm.value.group.toUpperCase( ),
          iconName: 'apps',
          children: [qmgrinfo]
        }];
      }
      
    }
    const acereply = window.electronIpcSendSync('updateQM', JSON.stringify(this.dataServ.arrACE));
    this.snackBar.open(acereply, '', {
      duration: 3000,
    });
    this.aceForm.reset();
    this._dialog.closeAll();
    }
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  title = 'MidLEO';
  mobileQuery: MediaQueryList;
  aceForm: FormGroup;
  objectKeys = Object.keys;

  encryptSecretKey  = 'VMIDteam';

  private mobileQueryListener: () => void;

  constructor(
    public dataServ: DataService,
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
    public overlayContainer: OverlayContainer,
    private navService: NavService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
  }
  @HostBinding('class') componentCssClass: string;
  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
  ngOnInit() {
    window.electronIpcOnce('readQMListData', (event, arg) => {
      const data = JSON.parse(arg);
      this.dataServ.arrACE = data;
    });
    window.electronIpcSend('readQMList');
  }
  onSetTheme(theme: string) {
    this.overlayContainer.getContainerElement().classList.remove('midleo-dark-theme');
    this.overlayContainer.getContainerElement().classList.remove('midleo-light-theme');
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }
  openiibdialog() {
    const dialogRef = this._dialog.open(DialogContentiibdialogComponent, { minWidth: 300 });
  }
  encryptThis(thistext: string) {
    return CryptoJS.AES.encrypt(thistext, this.encryptSecretKey).toString();
  }
  decryptThis(thistext: string) {
    return CryptoJS.AES.decrypt(thistext.toString().replace(/ /g, ''), this.encryptSecretKey).toString(CryptoJS.enc.Utf8);
  }
}

