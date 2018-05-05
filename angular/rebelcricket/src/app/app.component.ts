import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // directives: [ NavComponent ]
})
export class AppComponent implements OnInit {

  constructor(
    private location: Location,
    public router: Router
    // public dialog: MatDialog
  ) { 

  }

  ngOnInit() {
    
  }


}
