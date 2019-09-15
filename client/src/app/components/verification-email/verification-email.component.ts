import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastService, } from '../../../shared/shared.service';
import { UserService } from '../../../services/api.service';
@Component({
  selector: 'app-verication',
  template: ''
})
export class MailVerficationComponent {
  public accessToken: any;
  public response: any;
  constructor(
    private router: Router,
    private toasty: ToastService,
    private routes: ActivatedRoute,
    public userService: UserService
  ) {

    this.routes.params.subscribe((params: Params) => {
      this.accessToken = { accessToken: params['accessToken'] };
    });
  }
  ngOnInit() {

    console.log(this.accessToken)
    this.userService.mailVerification(this.accessToken).subscribe(res => {
      if (!!res.success) {
        this.toasty.show("success", res.message);
        // this.router.navigate([''])
      }
      else
      {
        // this.router.navigate(['/signup'])
        this.toasty.show("error", res.message);
      }
      this.router.navigate([''])  
    },
      err => {
        this.toasty.show("error", err.error.messages);
        this.router.navigate([''])
      });
  }
}

