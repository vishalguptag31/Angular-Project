import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HeaderService } from '../../../../shared/shared.service';
@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {
  public userName = JSON.parse(localStorage.getItem('user')).full_name;

  constructor(private router: Router, private headerService:HeaderService) { }

  ngOnInit() { }

  logOut() {
    localStorage.clear();
    this.headerService.updateHeader(false)
    this.router.navigate([''])
  }

}
