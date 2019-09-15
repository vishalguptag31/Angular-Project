import { Component, OnInit, ViewChild } from '@angular/core';
import { AssigneeData } from '../../../../../shared/shared.object';
import { UserService } from '../../../../../services/api.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../shared/shared.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  public user: AssigneeData;
  public enableLoader: boolean;
  public emailExists: boolean;
  public phoneExists: boolean;
  public currentUserId = JSON.parse(localStorage.getItem('user')).id;
  public modalRef: BsModalRef;
  public existingUserToRelate: AssigneeData;
  public isCheck: boolean;
  @ViewChild('existingUser') existingUserModalRef: any;

  constructor(
    private userService: UserService,
    private router: Router,
    public toasty: ToastService,
    public modalService: BsModalService
  ) {
    this.user = new AssigneeData();
    this.existingUserToRelate = new AssigneeData();
  }

  ngOnInit() {

  }

  addUser(form) {
    this.enableLoader = true;
    /* Check email already existing */
    this.userService.emailExists(this.user.email)
      .subscribe(res => {
        if (res.length > 0) {
          this.enableLoader = false;
          this.existingUserToRelate = res[0];
          if (this.currentUserId == this.existingUserToRelate.id) {
            this.isCheck = true;
            this.toasty.show("warning", "This email belongs to you.");
          }
          else {
            if (this.currentUserId == this.existingUserToRelate.added_by) {
              this.toasty.show("warning", "An user already exists with this email in your list.")
            } else {
              this.modalRef = this.modalService.show(this.existingUserModalRef);
            }
          }
        }
        else {
          /* Add new user */
          this.user.host = window.location.protocol + "//" + window.location.host;
          this.user.added_by = this.currentUserId;
          this.userService.addUserAssignee(this.user)
            .subscribe(
              res => {
                this.enableLoader = false;
                this.toasty.show("success", "User added successfully")
                this.router.navigate(['task/user']);
              },
              error => {
                this.enableLoader = false;
                console.log(error)
              }
            )
        }
      },
        err => {
          this.enableLoader = false
          this.toasty.show("error", err.error.messages);
        });

  }

  trimField() {
    for (const key in this.user) {
      if (this.user.hasOwnProperty(key)) {
        let element = this.user[key];
        this.user[key] = element.trim().replace(/  +/g, ' ')
      }
    }
  }



  addUserRelation(): void {
    this.userService.addUserRelation({ current: this.currentUserId, existing: this.existingUserToRelate.id })
      .then(result => {
        let response: any = result
        if (!!response.dataAlreadyExist) {
          this.modalRef.hide();
          this.toasty.show("error", "Email already exist from your user list.")
        }
        else {
          this.modalRef.hide();
          this.toasty.show("success", "User added successfully")
          this.router.navigate(['task/user'])
        }

      })
      .catch(error => {
        console.log(error);
      })

  }

  // checkUniquePhoneNumber() {
  //   this.userService.phoneExists(this.user.phone_number)
  //     .subscribe(res => {
  //       this.phoneExists = res.emailExist;
  //     }, err => {
  //       this.toasty.show("error", err.json().messages);
  //     });
  // }

}
