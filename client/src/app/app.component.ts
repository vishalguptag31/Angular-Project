import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../shared/shared.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public showHeader = localStorage.getItem('user') !== null;;
  public showFooter = localStorage.getItem('user') !== null;;
  public isModalShown: boolean = false;
  constructor(private headerService: HeaderService) { }

  ngOnInit(): void {
    this.isModalShown = true;
    this.headerService.currentMessage
      .subscribe(value => {
        this.showHeader = value;
        this.showFooter = value;
      });
  }
}
