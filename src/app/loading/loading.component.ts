import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  // Only public services can be utilized directly in HTML
  constructor( public loadingService: LoadingService) {

  }

  ngOnInit() {

  }

}
