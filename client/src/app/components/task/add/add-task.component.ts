import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { Task, AssigneeData, Category } from '../../../../shared/shared.object';
import { ToastService } from '../../../../shared/shared.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../../services/api.service';

@Component({
    selector: 'tsf-add-task',
    templateUrl: 'add-task.component.html'
})
export class AddTaskComponent implements OnInit {
    public minDate = new Date();
    public maxDate = this.minDate;
    public userData: any;
    public categoryData: any;
    public task: Task;
    public taskId: number;
    public loading: boolean;
    public assignee: AssigneeData;
    public category: Category;
    public users = [];
    public message;
    public showMessage: boolean = false;
    public messageCategory;
    public showCategory: boolean = false;
    public isEmailExist: boolean = false;
    public isPhoneNumberExist: boolean = false;
    public currentUserId = JSON.parse(localStorage.getItem('user')).id;
    public existingUserToRelate: AssigneeData;
    public modalRef1: BsModalRef;
    public modalRef2: BsModalRef;
    public forms: any;
    public isAllUser : boolean = false;
    @ViewChild('assigneeForm') assigneeForm: NgForm;
    constructor(
        public router: Router,
        public http: Http,
        public route: ActivatedRoute,
        public toasty: ToastService,
        private modalService: BsModalService,
        public userService: UserService,
    ) {
        this.assignee = new AssigneeData();
        this.category = new Category();
        this.task = new Task();
        this.userDetail();
        this.existingUserToRelate = new AssigneeData();
        this.categoryDetail();
        if (this.route.snapshot.params.id != undefined) {
            this.taskId = this.route.snapshot.params.id;
            this.getTaskById()

        }
    }


    ngOnInit() {
    }
    userDetail() {
        this.userService.getAssigneeList(this.currentUserId)
            .subscribe(
                res => {
                    let response: any = res;
                    this.userData = response;
                }, err => {
                    this.toasty.show("Error!", err.error.message);
                });
    }

    categoryDetail() {
        this.userService.getCategory(this.currentUserId)
            .subscribe(
                res => {
                    let response = res.data;
                    this.categoryData = response;
                }, err => {
                    this.toasty.show("Error!", err.error.message);
                });
    }

    getTaskById() {
        this.loading = true;
        this.userService.getTaskById(this.taskId)
            .subscribe(
                resp => {
                    this.loading = false;
                    let response: any = resp.data;
                    this.task = response[0];
                    this.minDate = new Date(this.task.completion_date)
                    this.task.completion_date = new Date(this.task.completion_date);
                },
                err => {
                    this.loading = false;
                    this.toasty.show("Error!", err.error.message);
                }
            )
    }

    submitForm() {       
        this.loading = true;
        let method = this.route.snapshot.params.id ? 'put' : 'post';
        let api = this.route.snapshot.params.id ? '/updateTask/' + this.taskId : '/addTask';
        this.task.assigned_by = JSON.parse(localStorage.getItem('user')).id;
        this.task.status = 'Pending';
        this.userService.submitForm(method, api, this.task).subscribe(
            res => {

                this.loading = false;
                this.toasty.show("success", "Task " + (method === 'put' ? 'updated' : 'added') + " successfully.");
                this.router.navigate(['/task'])
            }, err => {
                console.log(err)
                this.loading = false;
                this.toasty.show('error', err.json().messages);
            });
    }


    addCategory(template) {
        this.modalRef1 = this.modalService.show(template, {
            backdrop: true,
            ignoreBackdropClick: true
        });
    }

    
    validateCheckBox(event)
    {
        if(event.target.checked == true)
        {
            this.isAllUser = true  
            this.task.user_id = 0
        }
        else
        {
            this.isAllUser =false;
            this.task.user_id =null;
        }
        // console.log(event.target.checked == true)
        
        // event.target.checked == true ? this.isAllUser = true  : this.isAllUser =false;
        // this.task.user_id = 0
        
    }

    checkUniqueEmail() {
        if (this.assignee.email) {
            this.userService.emailExists(this.assignee.email)
                .subscribe(res => {
                    this.existingUserToRelate = res[0];
                    if (this.currentUserId == this.existingUserToRelate.added_by) {
                        this.isEmailExist = true;
                    } else {
                        this.isEmailExist = false;
                    }

                }, err => {
                    this.toasty.show("error", err.json().messages);
                });
        }
    }


    addUserRelation() {
        this.userService.addUserRelation({ current: this.currentUserId, existing: this.existingUserToRelate.id })
            .then(result => {
                let response: any = result
                if (!!response.dataAlreadyExist) {
                    this.modalRef2.hide();
                    this.toasty.show("error", "Email already exist from your user list.")
                }
                else {
                    this.modalRef2.hide();
                    this.forms.resetForm();
                    this.modalRef1.hide();
                    this.toasty.show("success", "User added successfully");
                    this.userDetail()
                }

            }, error => {

            })

    }

    addAssignee(template, form: NgForm) {
        this.forms = form;
        this.loading = true;
        this.userService.emailExists(this.assignee.email)
            .subscribe(res => {
                if (res.length > 0) {
                    this.loading = false;
                    this.existingUserToRelate = res[0];
                    if (this.currentUserId == this.existingUserToRelate.id) {
                        // this.isCheck = true;
                        this.toasty.show("warning", "This email belongs to you.");
                    }
                    else {
                        if (this.currentUserId == this.existingUserToRelate.added_by) {
                            this.toasty.show("warning", "An user already exists with this email in your list.")
                        } else {
                            this.modalRef2 = this.modalService.show(template, {
                                backdrop: true,
                                ignoreBackdropClick: true
                            });
                        }
                    }
                }
                else {
                    /* Add new user */
                    this.assignee.host = window.location.protocol + "//" + window.location.host;
                    this.assignee.added_by = this.currentUserId;
                    this.userService.addUserAssignee(this.assignee)
                        .subscribe(
                            res => {
                                this.loading = false;
                                form.resetForm();
                                this.userDetail();
                                this.modalRef1.hide();
                                this.toasty.show("success", "User added successfully");

                            },
                            error => {
                                this.loading = false;
                                console.log(error)
                            }
                        )
                }
            },
                err => {
                    this.loading = false
                    this.toasty.show("error", err.error.messages);
                });

    }

    trimField() {

        if (this.task.task_name) {
            this.task.task_name = this.task.task_name.trim();
            this.task.task_name = this.task.task_name.replace(/  +/g, ' ');
        }

        if (this.assignee.full_name) {
            this.assignee.full_name = this.assignee.full_name.trim();
            this.assignee.full_name = this.assignee.full_name.replace(/  +/g, ' ');
        }

        if (this.assignee.password) {
            this.assignee.password = this.assignee.password.trim();
            this.assignee.password = this.assignee.password.replace(/  +/g, ' ');
        }

        if (this.assignee.email) {
            this.assignee.email = this.assignee.email.trim();
            this.assignee.email = this.assignee.email.replace(/  +/g, ' ');
        }
    }

    saveCategory(form: NgForm) {
        this.loading = true;
        this.category.added_by = JSON.parse(localStorage.getItem('user')).id;
        this.userService.saveCategory(this.category)
            .subscribe(
                res => {
                    this.loading = false;
                    let response: any = res;
                    if (!response.alreadyExist) {
                        this.modalRef1.hide();
                        this.categoryDetail();
                        form.resetForm();
                        this.toasty.show("success", response.message)
                    } else {

                        this.showCategory = true;
                        this.messageCategory = "Category already exist!";
                        setTimeout(function () {
                            this.messageCategory = null;
                        }.bind(this), 5000);
                    }
                }, err => {
                    this.loading = false;
                    this.toasty.show('error', err.message)
                });
    }

    cancelAddingUser() {
        this.modalRef2.hide();
    }

    clearModalData() {
        this.assignee = new AssigneeData();
        this.category = new Category();
    }
}
