import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ChangePasswordData, User } from '../../../shared/shared.object';
import { UserService } from '../../../services/api.service'
import { ToastService } from '../../../shared/shared.service'
import { Http } from '@angular/http';

@Component({
    selector: 'app-login',
    templateUrl: './changePassword.component.html',
    styleUrls: ['./changePassword.component.css'],
})
export class ChangePasswordComponent implements OnInit {
    public changePasswordData: ChangePasswordData;
    public user: User
    public errorMessage: string;
    public invalidCurrentPassword: string;
    public passwordNotMatch: boolean;
    public errorPasswordMessage: string;
    constructor(
        private router: Router,
        private toasty: ToastService,
        public userService:UserService
    ) {
        this.changePasswordData = new ChangePasswordData;
        this.user = new User;
    }

    ngOnInit() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (!!user) {
            this.user = user;
        }
        else {
            this.router.navigate(['']);
        }
    }


    changePassword() {
        // this.invalidCurrentPassword = false;
        if (this.changePasswordData.new_password == this.changePasswordData.confirm_password) {
            let passwordObj = {
                email: this.user.email,
                current_password: this.changePasswordData.current_password,
                new_password: this.changePasswordData.new_password,
            };
     this.userService.changePassword(passwordObj).subscribe(
                    res => { 
                        let response:any = res;
                        this.router.navigate(['/dashboard']);
                        this.toasty.show("success", response.message);
                    }, err => {
                       this.invalidCurrentPassword ="Current password is incorrect"
                    });
        }
        else {
            this.passwordNotMatch = true;
            this.errorPasswordMessage = "Password did not match.";
            setTimeout(()=>{    
                this.passwordNotMatch = false;
                this.errorPasswordMessage =null;
           }, 3000);
        }
    }

    trimPasswordField() {

        if (this.changePasswordData.current_password) {
            this.changePasswordData.current_password = this.changePasswordData.current_password.trim();
            this.changePasswordData.current_password = this.changePasswordData.current_password.replace(/  +/g, '');
        }
        if (this.changePasswordData.new_password) {
            this.changePasswordData.new_password = this.changePasswordData.new_password.trim();
            this.changePasswordData.new_password = this.changePasswordData.new_password.replace(/  +/g, '');
        }
        if (this.changePasswordData.confirm_password) {
            this.changePasswordData.confirm_password = this.changePasswordData.confirm_password.trim();
            this.changePasswordData.confirm_password = this.changePasswordData.confirm_password.replace(/  +/g, '');
        }
    }

    validateSpace(evt): string {
            return evt.target.value.trim().replace(/  +/g, '')
    }



}
