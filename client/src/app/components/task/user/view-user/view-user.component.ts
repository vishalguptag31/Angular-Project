import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/api.service';
import { User } from '../../../../../shared/shared.object';
import { ExcelService } from '../../../../../shared/shared.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  public enableLoader: boolean;
  public users: Array<User>;
  public currentUserId = JSON.parse(localStorage.getItem('user')).id;

  constructor(private userService: UserService, public excel: ExcelService) {
    this.users = new Array<User>();
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getAssigneeList(this.currentUserId)
      .subscribe(
        users => {
          this.users = users;
        },
        error => {
          console.log(error)
        }
      )
  }

  download(){
    this.excel.exportAsExcelFile(this.users, 'user')
  }

}
