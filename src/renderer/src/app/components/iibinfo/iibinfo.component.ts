import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from '../../common/data.service';
import { Router , NavigationEnd } from '@angular/router';
import { MatSort } from '@angular/material/sort'; 
import { MatPaginator } from '@angular/material/paginator'; 
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dialog-qidialog',
  templateUrl: './dialog-qidialog.html',
})
export class DialogDataQIDialogComponent {
  constructor(public dataServ: DataService) {}
  QIdata = this.dataServ.iiblistreply[this.dataServ.qiid];
}

@Component({
  selector: 'app-iibinfo-component',
  templateUrl: './iibinfo.component.html',
  styleUrls: ['../main/qmcontent.css']
})
export class iiblistComponent implements OnInit, OnDestroy {
  navigationSubscription;
  displayedQLColumns: string[] = [
    'name',
    'type',
    'crdate',
    'crtime',
    'depth',
    'maxdepth',
    'maxmsgl',
    'defbind',
    'altdate',
    'alttime',
    'actions'
  ];
  dataSourceQL = new MatTableDataSource();
  constructor(public dataServ: DataService, public dialog: MatDialog, private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.dataServ.jsonkeychanged) { this.dataServ.iiblist = []; }
        this.getQL();
      }
    });
  }

  @ViewChild('QLSort', {static: true}) QLSort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    if (this.dataServ.jsonkeychanged) { this.dataServ.iiblist = []; }
    this.getQL();
  }
  getQL() {

  this.dataServ.selectedACE = this.dataServ.arrACEtemp.name;
//  this.dataServ.systemobj = thissysobj;
//  this.dataServ.emptyobj = thisemptyobj;

  if (!this.dataServ.iiblist || this.dataServ.iiblist.length < 1) {
    this.dataServ.jsonkeychanged = false;
    this.dataServ.iiblist = [];
    this.dataServ.iiblistreply = [];
  //  this.dataServ.systemobj = thissysobj;
  //  this.dataServ.emptyobj = thisemptyobj;
    const ACEinput = {
      type: 'READ',
      hostname: this.dataServ.arrACEtemp.hostname,
      channel: this.dataServ.arrACEtemp.channel,
      port: this.dataServ.arrACEtemp.port,
      qmanager: this.dataServ.arrACEtemp.name,
      function: 'QUEUES',
      systemobj: this.dataServ.systemobj,
      ssl: this.dataServ.arrACEtemp.ssl,
      sslkey: this.dataServ.arrACEtemp.sslkey,
      sslpass: this.dataServ.arrACEtemp.sslpass,
      sslcipher: this.dataServ.arrACEtemp.sslcipher
    };
    let acereply: any;
    try {
      acereply = JSON.parse(window.electronIpcSendSync('execPCFQD', JSON.stringify(ACEinput)));
      this.dataServ.dataerr = false;
    } catch (e) {
      acereply = '';
      this.dataServ.dataerr = true;
    }
    if (acereply.queues) {
    this.dataServ.iiblistreply = acereply.queues;
    for ( const [key, value] of Object.entries( acereply.queues ) ) {
      this.dataServ.iiblist.push({
         objkey: key,
         name: value['QUEUE'],
         type: value['TYPE'],
         crdate: value['CRDATE'],
         crtime: value['CRTIME'],
         descr: value['DESCR'],
         depth: value['DEPTH'],
         maxdepth: value['MAXDEPTH'],
         maxmsgl: value['MAXMSGL'],
         cluster: value['CLUSTER'],
         defbind: value['DEFBIND'],
         altdate: value['ALTDATE'],
         alttime: value['ALTTIME'],
         defpsist: value['DEFPSIST']
      });
     }
    } else { this.dataServ.iiblist = []; }
   }
  this.dataSourceQL.data = this.dataServ.iiblist;
  this.dataSourceQL.sort = this.QLSort;
  this.dataSourceQL.paginator = this.paginator;
  }
  applyFilter(filterValue: string) {
    this.dataSourceQL.filter = filterValue.trim().toLowerCase();
  }
  openQIDialog(thisid: number) {
    this.dataServ.qiid = thisid;
    this.dialog.open(DialogDataQIDialogComponent, { minWidth: 400 });
  }
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataServ.iiblist);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'iibinfo');
    XLSX.writeFile(wb, this.dataServ.arrACEtemp.name + '_queues.xlsx');
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }
}
