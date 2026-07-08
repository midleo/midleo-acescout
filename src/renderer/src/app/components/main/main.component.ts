import { Component, OnInit } from '@angular/core';
import { DataService } from '../../common/data.service';

@Component({
  standalone: false,
  selector: 'app-componentmain',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainContentComponent implements OnInit {

  constructor(public dataServ: DataService) { }

  ngOnInit() {
  }
}
