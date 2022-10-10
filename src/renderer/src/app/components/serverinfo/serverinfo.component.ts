import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from '../../common/data.service';
import { Router , NavigationEnd } from '@angular/router';
import { MatSort } from '@angular/material/sort'; 
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-serverinfo-component',
  templateUrl: './serverinfo.component.html',
  styleUrls: ['../main/qmcontent.css']
})
export class ACEServerComponent implements OnInit, OnDestroy {
  navigationSubscription;
  displayedQMColumns: string[] = ['aceattr', 'acedata'];

  dataSource = new MatTableDataSource();
  constructor(public dataServ: DataService, private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.dataServ.jsonkeychanged) { this.dataServ.acedata = []; }
        this.getIIBI();
      }
    });
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    if (this.dataServ.jsonkeychanged) { this.dataServ.acedata = []; }
    this.getIIBI();
  }
  getIIBI() {

  this.dataServ.selectedACE = this.dataServ.arrACEtemp.name;
  this.dataServ.selectedACEInfo = 'Info about the qmanager';

  if (!this.dataServ.acedata || this.dataServ.acedata.length < 1) {
    this.dataServ.jsonkeychanged = false;
    this.dataServ.acedata = [];
    const ACEinput = {
      type: 'get',
      brokerhost: this.dataServ.arrACEtemp.hostname,
      brokerport: this.dataServ.arrACEtemp.port,
      data: '.apiv2.servers'
    };
    if(this.dataServ.arrACEtemp.auth=="basic"){
      ACEinput["brokeruser"]=this.dataServ.arrACEtemp.usrname;
      ACEinput["brokerpass"]=this.dataServ.arrACEtemp.usrpass;
    }
    if(this.dataServ.arrACEtemp.ssl=="yes"){
      ACEinput["sslkey"]=this.dataServ.arrACEtemp.sslkey;
      ACEinput["sslpass"]=this.dataServ.arrACEtemp.sslpass,
      ACEinput["sslcipher"]=this.dataServ.arrACEtemp.sslcipher
    }
    let acereply: any;
    try {
      acereply = JSON.parse(window.electronIpcSendSync('execPCFQD', JSON.stringify(ACEinput)));
      this.dataServ.dataerr = false;
    } catch (e) {
      acereply = '';
      this.dataServ.dataerr = true;
    }

    for (const i in acereply) {
     this.dataServ.acedata.push({
      aceattr: i,
      acedata: acereply[i] || "",
      acecolor: (i=="active.state"?(acereply[i]=="started"?"alert-success":"alert-danger"):"")
     });
    }

  }
  
  this.dataSource.data = this.dataServ.acedata;
  this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }
}
