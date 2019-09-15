import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login, AssigneeData, SignUpData } from '../../../shared/shared.object';
import { HeaderService, ToastService, TokenService } from '../../../shared/shared.service'
import { UserService } from '../../../services/api.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';

@Component({
    selector: 'simpli-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    public login: Login;
    public signup: AssigneeData;
    public enableLoader: boolean;
    public showLoginForm: boolean;
    public confirmPasswordError: boolean = false;
    public displayResendLink: boolean = false;
    public resendEmailVerficationLink: boolean = false;
    public errorMessage: string;
    public resendEmail: string

    constructor(
        private userService: UserService,
        private router: Router,
        private tokenService: TokenService,
        private headerService: HeaderService,
        private toasty: ToastService
    ) {
        this.login = new Login();
        this.signup = new AssigneeData()
    }

    ngOnInit() {
        /**
         * Redirect user to task if logged in when 
         * the login page is called through url.
         */
        if (!!localStorage.getItem('user')) {
            this.router.navigate(['/task']);
        }
        else {
            this.showLoginForm = true
        }

    }

    openSignupForm(form: NgForm) {
        this.showLoginForm = false
        this.displayResendLink = false
        form.resetForm();
        this.signup = new AssigneeData()

    }
    openLoginForm(form: NgForm) {
        this.showLoginForm = true
        this.displayResendLink = false
        form.resetForm();
        this.login = new Login();
    }


    trimField(type) {
        /**
         * Trim spaces from each properties
         */
        if (type == 'login') {
            for (const prop in this.login) {
                if (this.login.hasOwnProperty(prop)) {
                    const element = this.login[prop];
                    this.login[prop] = element.trim().replace(/  +/g, ' ');
                }
            }
        }
        else {
            for (const prop in this.signup) {
                if (this.signup.hasOwnProperty(prop)) {
                    const element = this.signup[prop];
                    this.signup[prop] = element.trim().replace(/  +/g, ' ');
                }
            }
        }

    }

    validateSpacePassword(evt, type) {
        var keycode = evt.charCode || evt.keyCode;
        if (type == 'loginPassword') {
            if (keycode == 229 || keycode == 32) {
                this.login.password = this.login.password.trim();
                this.login.password = this.login.password.replace(/  +/g, '');
            }
        }
        else if (type == 'signupPassword') {
            if (keycode == 229 || keycode == 32) {
                this.signup.password = this.signup.password.trim();
                this.signup.password = this.signup.password.replace(/  +/g, '');
            }
        }
        else {
            if (keycode == 229 || keycode == 32) {
                this.signup.confirm_password = this.signup.confirm_password.trim();
                this.signup.confirm_password = this.signup.confirm_password.replace(/  +/g, '');
            }
        }
    }


    proceedLogin() {
        this.enableLoader = true;
        this.userService.login(this.login)
            .subscribe(res => {
                this.enableLoader = false;
                let response: any = res;
                this.tokenService.setToken(response.jwt_token);
                localStorage.setItem('user', JSON.stringify(response.data));
                this.router.navigate(['/task']);
                this.toasty.show('success', 'Login successful');
                this.headerService.updateHeaderService(true)
            }, err => {
                this.enableLoader = false;
                this.toasty.show('error', err.error.message);
            })

    }

    doSignup(form: NgForm) {
        this.enableLoader = true;
        if (this.signup.password != this.signup.confirm_password) {
            this.enableLoader = false;
            this.confirmPasswordError = true;
            setTimeout(() => {
                this.confirmPasswordError = false;
            }, 3000);
        }
        else {
            this.signup.host = window.location.protocol + "//" + window.location.host;
            this.userService.userSignUp(this.signup).subscribe(res => {
                this.enableLoader = false;
                let response: any = res
                this.resendEmail = response.data;
                this.displayResendLink = true;
                if (!!response.dataExist) {
                    var message = `It looks like<strong class='fg-color-theme'> ${response.data} </strong> belongs to an existing account.`;
                    this.errorMessage = message;
                }
                else {
                    var message = `An email has been sent to <strong class='fg-color-theme'> ${response.data}. </strong> Please check your email (inbox/spam/junk folder) for the activation link. Or `;
                    this.toasty.show("success", "Successfully registered");
                    this.errorMessage = message;
                    form.resetForm();
                }
            },
                err => {
                    this.enableLoader = false;
                })
        }
    }

    resendLink() {
        this.enableLoader = true;
        this.signup.host = window.location.protocol + "//" + window.location.host;
        let obj = {
            host: this.signup.host,
            email: this.resendEmail
        }
        this.userService.sendEmailVerification(obj).subscribe(res => {
            this.enableLoader = false;
            let response: any = res;

            var message = `An email has been sent to <strong class='fg-color-theme'> ${response.data}. </strong> Please check your email (inbox/spam/junk folder) for the activation link. Or `;
            this.errorMessage = message;
        },
            err => {
                this.enableLoader = false;
                this.toasty.show("error", err.error.message)
            })
    }
    closeMessageDiv() {
        this.displayResendLink = false;
    }


}
