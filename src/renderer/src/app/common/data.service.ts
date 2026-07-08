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

  jsonkey: number;
  jsonsubkey: number;
  jsonkeychanged = false;

  constructor() {  }

}
