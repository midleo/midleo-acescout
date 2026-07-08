import { Component, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy, AfterViewInit, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaMatcher } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatSidenav } from '@angular/material/sidenav';
import { NavService } from './components/menu-list-item/nav.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from './common/data.service';
import { ElectronService } from './core/electron.service';

export const ACE_NAV_CHILDREN = [
  { name: 'Server Info', iconName: 'dns', route: 'showServer' },
  { name: 'INT Server', iconName: 'hub', route: 'showINTServer' },
  { name: 'Remove connection', iconName: 'delete_outline', route: 'deleteACE', danger: true },
];

@Component({
  standalone: false,
  selector: 'app-iibdialog-dialog',
  templateUrl: './components/iibdialog/iibdialog-dialog.html',
  styleUrls: ['./components/iibdialog/iibdialog-dialog.css']
})
export class DialogContentiibdialogComponent implements OnInit {
  aceForm: FormGroup;
  isSaving = false;

  constructor(
    private _dialog: MatDialog,
    public dataServ: DataService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private electron: ElectronService
  ) { }

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
    }, { updateOn: 'change' });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.aceForm.controls[controlName].hasError(errorName);
  }

  async createQM() {
    this.aceForm.markAllAsTouched();
    this.aceForm.updateValueAndValidity();
    if (!this.aceForm.valid) {
      this.snackBar.open('Please fill in all required fields', '', { duration: 4000 });
      return;
    }

    const aceinfo = {
      iconName: 'more_vert',
      name: this.aceForm.value.hostname.toUpperCase(),
      hostname: this.aceForm.value.hostname,
      port: this.aceForm.value.port,
      auth: this.aceForm.value.auth,
      usrname: this.aceForm.value.usrname,
      usrpass: this.aceForm.value.usrpass !== '' ? (window.btoa(this.aceForm.value.usrpass)).replace(new RegExp('=', 'g'), '') : '',
      ssl: this.aceForm.value.ssl,
      sslkey: this.aceForm.value.sslkey !== '' ? (window.btoa(this.aceForm.value.sslkey)).replace(new RegExp('=', 'g'), '') : '',
      sslpass: this.aceForm.value.sslpass !== '' ? this.aceForm.value.sslpass : null,
      sslcipher: this.aceForm.value.sslcipher !== '' ? this.aceForm.value.sslcipher : null,
      children: ACE_NAV_CHILDREN.map((c) => ({ ...c })),
    };

    const groupName = this.aceForm.value.group.toUpperCase();
    const groups = Array.isArray(this.dataServ.arrACE)
      ? this.dataServ.arrACE.filter((g) => g && g.name && Array.isArray(g.children))
      : [];

    let nextGroups: typeof groups;
    if (groups.some((e) => e.name === groupName)) {
      nextGroups = groups.map((g) =>
        g.name === groupName
          ? { ...g, children: [...g.children, aceinfo] }
          : { ...g, children: [...g.children] }
      );
    } else {
      nextGroups = [
        ...groups,
        {
          name: groupName,
          iconName: 'apps',
          children: [aceinfo],
        },
      ];
    }
    this.dataServ.arrACE = nextGroups;

    this.isSaving = true;
    try {
      const acereply = await this.electron.updateAce(JSON.stringify(this.dataServ.arrACE));
      this.snackBar.open(acereply, '', { duration: 3000 });
      this.aceForm.reset();
      this._dialog.closeAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save ACE server';
      this.snackBar.open(message, '', { duration: 5000 });
    } finally {
      this.isSaving = false;
    }
  }
}

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('snav', { static: false }) snav: MatSidenav;
  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  title = 'Midleo ACEScout';
  mobileQuery: MediaQueryList;
  sidenavOpened = true;
  activeTheme = 'midleo-light-theme';

  private mobileQueryListener: () => void;

  constructor(
    public dataServ: DataService,
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private electron: ElectronService,
    public overlayContainer: OverlayContainer,
    private navService: NavService,
    private cdr: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => this.cdr.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  @HostBinding('class') componentCssClass: string;

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  trackByGroupName(_index: number, item: { name?: string }): string {
    return item?.name ?? String(_index);
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  async ngOnInit() {
    this.onSetTheme(this.activeTheme);
    try {
      const raw = await this.electron.readAceList();
      const parsed = JSON.parse(raw);
      this.dataServ.arrACE = Array.isArray(parsed)
        ? parsed.filter((g) => g && g.name && Array.isArray(g.children))
        : [];
    } catch (error) {
      this.dataServ.arrACE = [];
      const message = error instanceof Error ? error.message : 'Unable to load saved ACE servers';
      this.snackBar.open(message, '', { duration: 4000 });
    }
  }

  onSetTheme(theme: string) {
    if (!theme) {
      return;
    }
    this.activeTheme = theme;
    const root = document.documentElement;
    root.classList.remove('midleo-dark-theme', 'midleo-light-theme');
    root.classList.add(theme);
    document.body.classList.remove('midleo-dark-theme', 'midleo-light-theme');
    document.body.classList.add(theme);
    this.overlayContainer.getContainerElement().classList.remove('midleo-dark-theme', 'midleo-light-theme');
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }

  openiibdialog() {
    const dialogRef = this._dialog.open(DialogContentiibdialogComponent, { minWidth: 420, maxWidth: '95vw', panelClass: 'ace-dialog-panel' });
    dialogRef.afterClosed().subscribe(() => {
      if (Array.isArray(this.dataServ.arrACE)) {
        this.dataServ.arrACE = this.dataServ.arrACE.map((g) => ({
          ...g,
          children: Array.isArray(g.children) ? [...g.children] : [],
        }));
      }
      this.cdr.detectChanges();
    });
  }
}
