import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  selectedACE: any;
  selectedACEInfo: any;
  arrACE: any [] ;
  arrACEtemp: any ;

  loadthis = false;
  dataerr = false;
  acedata: any [];
  acelist: any [];

  iiblist: any [];
  iiblistreply: [];

  chlist: any [];
//  chlistreply: [];

  topiclist: any [];
//  topiclistreply: [];

  sublist: any [];
//  sublistreply: [];

  authlist: any [];
//  authlistreply: [];

  systemobj = 'no';
  emptyobj = 'no';
  qiid: number;
  jsonkey: number;
  jsonsubkey: number;
  jsonkeychanged = false;
  objmapping = new Map([
    [ 'QUEUE', 'Queue Name' ],
    [ 'TYPE', 'Queue Type' ],
    [ 'ALTDATE', 'Altered Date' ],
    [ 'ALTTIME', 'Altered Time' ],
    [ 'CLUSTER', 'Cluster' ],
    [ 'CRDATE', 'Created Date' ],
    [ 'CRTIME', 'Created Time' ],
    [ 'DEFBIND', 'Default message binding' ],
    [ 'DEFPSIST', 'Default Persistence' ],
    [ 'DEPTH', 'Current Depth' ],
    [ 'DESCR', 'Description' ],
    [ 'MAXDEPTH', 'Maximum depth of queue' ],
    [ 'MAXMSGL', 'Maximum message length' ],
    [ 'MCAUSER', 'MCA user' ],
    [ 'CHANNEL', 'Channel Name' ],
    [ 'CHLTYPE' , 'Channel Type' ],
  ]);

  constructor() {  }

}
