import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from '../../common/data.service';
import { ElectronService } from '../../core/electron.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  standalone: false,
  selector: 'app-serverlist-component',
  templateUrl: './serverlist.component.html',
  styleUrls: ['../main/qmcontent.css']
})
export class ACEServerListComponent implements OnInit, OnDestroy {
  navigationSubscription;
  displayedQMColumns: string[] = ['aceattr', 'acedata'];

  dataSourceSL = new MatTableDataSource();
  constructor(
    public dataServ: DataService,
    private electron: ElectronService,
    private router: Router
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.dataServ.jsonkeychanged) { this.dataServ.acelist = []; }
        this.getIIBL();
      }
    });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    if (this.dataServ.jsonkeychanged) { this.dataServ.acelist = []; }
    this.getIIBL();
  }

  async getIIBL() {
    this.dataServ.selectedACE = this.dataServ.arrACEtemp.name;
    this.dataServ.selectedACEInfo = 'Info about the integration node';

    if (!this.dataServ.acelist || this.dataServ.acelist.length < 1) {
      this.dataServ.jsonkeychanged = false;
      this.dataServ.acelist = [];
      const ACEinput: Record<string, unknown> = {
        type: 'get',
        brokerhost: this.dataServ.arrACEtemp.hostname,
        brokerport: this.dataServ.arrACEtemp.port,
        data: '.apiv2'
      };
      if (this.dataServ.arrACEtemp.auth === 'basic') {
        ACEinput['brokeruser'] = this.dataServ.arrACEtemp.usrname;
        ACEinput['brokerpass'] = this.dataServ.arrACEtemp.usrpass;
      }
      if (this.dataServ.arrACEtemp.ssl === 'yes') {
        ACEinput['sslkey'] = this.dataServ.arrACEtemp.sslkey;
        ACEinput['sslpass'] = this.dataServ.arrACEtemp.sslpass;
        ACEinput['sslcipher'] = this.dataServ.arrACEtemp.sslcipher;
      }

      try {
        const acereply = await this.electron.execAce<Record<string, unknown>>(ACEinput);
        this.dataServ.dataerr = false;
        for (const i in acereply) {
          this.dataServ.acelist.push({
            aceattr: i,
            acedata: acereply[i] || ''
          });
        }
      } catch {
        this.dataServ.dataerr = true;
      }
    }

    this.dataServ.loadthis = false;
    this.dataSourceSL.data = [...this.dataServ.acelist];
    this.dataSourceSL.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSourceSL.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
