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
        this.getQMI();
      }
    });
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    if (this.dataServ.jsonkeychanged) { this.dataServ.acedata = []; }
    this.getQMI();
  }
  getQMI() {

  this.dataServ.selectedACE = this.dataServ.arrACEtemp.name;
  this.dataServ.selectedACEInfo = 'Info about the qmanager';

  if (!this.dataServ.acedata || this.dataServ.acedata.length < 1) {
    this.dataServ.jsonkeychanged = false;
    this.dataServ.acedata = [];
    const ACEinput = {
      type: 'get',
      brokerhost: this.dataServ.arrACEtemp.hostname,
      brokerport: this.dataServ.arrACEtemp.port,
      data: 'servers'
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
    if (acereply.children) {
    for (const property in acereply.children[0]) {
      if (typeof acereply.children[0][property] === 'object'){
        for (const propertyin in acereply.children[0][property]) {
          this.dataServ.acedata.push({
            aceattr: propertyin,
            acedata: acereply.children[0][property][propertyin]
           });
        }
      } else{
        this.dataServ.acedata.push({
          aceattr: property,
          acedata: acereply.children[0][property]
         });
      }
     }
     this.dataServ.acedata.push({
      aceattr: "..",
      acedata: ".."
     });
    this.dataServ.acedata.push({
      aceattr: "ACE Server hostname",
      acedata: this.dataServ.arrACEtemp.hostname
     });
    this.dataServ.acedata.push({
      aceattr: "ACE Server port",
      acedata: this.dataServ.arrACEtemp.port
    });
    } else { this.dataServ.acedata = []; }
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
