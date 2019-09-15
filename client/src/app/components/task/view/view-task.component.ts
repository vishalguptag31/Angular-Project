import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { Task,  } from '../../../../shared/shared.object';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService, TokenService, HeaderService, ExcelService } from '../../../../shared/shared.service';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/api.service';

@Component({
    selector: 'tsf-view-task',
    templateUrl: 'view-task.component.html'
})
export class ViewTaskComponent implements OnInit {
    public sortCategory: boolean;
    public sortUser: boolean;
    public taskUpdateObj: Array<any>;
    public pollTaskObject: Array<any>;
    public task: Task;
    // public query: AssigneeQuery;
    public manageTaskData: Array<Task>;
    public myTaskData: Array<Task>;
    public searchString: string;
    public userId: any;
    public userForDelete: any;
    public taskStatus: string;
    public loading: boolean;
    public currentUserId = JSON.parse(localStorage.getItem('user')).id;
    @Input() modalRef: BsModalRef;

    constructor(
        private modalService: BsModalService,
        private headerService: HeaderService,
        private excel: ExcelService,
        public router: Router,
        public toasty: ToastService,
        public userservice: UserService) {

        this.manageTaskData = new Array<Task>();
        this.myTaskData = new Array<Task>();
        this.task = new Task();
        this.taskUpdateObj = new Array<Object>(); 
        this.pollTaskObject = new Array<Object>();       
        this.sortCategory = false;
        this.sortUser = false;

    }

    ngOnInit() {
        let token = localStorage.getItem('jwt_token')
        if (!!token) {
            this.headerService.updateHeaderService(true)
            // let id = JSON.parse(localStorage.getItem('user')).id;
            this.getAllTasks(this.currentUserId);
        }
        else {
            this.router.navigate([''])
        }
    }

    getAllTasks(id) {
        this.loading = true
        this.userservice.getAllTasks(id)
            .subscribe(res => {
                let response: any = res
                this.loading = false;
                this.manageTaskData = response.manageTask;
                this.myTaskData = response.myTask;

            }, err => {
                console.log(err)
                this.loading = false;
                this.toasty.show('error', err.error);
            })
    }

    modelTaskDeleted(template: TemplateRef<any>, id) {
        this.userForDelete = id;
        this.modalRef = this.modalService.show(template, id);
    }

    deleteSelectedTask() {
        this.loading = true;
        this.userservice.deleteTask(this.userForDelete)
            .then(res => {
                this.loading = false;
                this.getAllTasks(this.currentUserId);
                this.toasty.show("success", "Task deleted successfully.");
            }, err => {
                this.loading = false;
                this.toasty.show('error', err.error);
            })

    }

    sortByUser(data, type) {
        this.sortUser = true;
        this.sortCategory = false;
        if (type = 'manageTask') {
            this.manageTaskData = data.sort(function (a, b) {
                var nameA = a.full_name.toLowerCase(), nameB = b.full_name.toLowerCase()
                if (nameA < nameB) //sort string ascending
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 //default return value (no sorting)

            })
        }
        else {
            this.myTaskData = data.sort(function (a, b) {
                var nameA = a.full_name.toLowerCase(), nameB = b.full_name.toLowerCase()
                if (nameA < nameB) //sort string ascending
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 //default return value (no sorting)

            })
        }
    }

    sortByCategory(data, type) {
        this.sortUser = false;
        this.sortCategory = true;
        if (type = 'manageTask') {
            this.manageTaskData = this.manageTaskData.sort(function (a, b) {
                var nameA = a.category_name.toLowerCase(), nameB = b.category_name.toLowerCase()
                if (nameA < nameB) //sort string ascending
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 //default return value (no sorting)

            })
        }
        else {
            this.myTaskData = data.sort(function (a, b) {
                var nameA = a.category_name.toLowerCase(), nameB = b.category_name.toLowerCase()
                if (nameA < nameB) //sort string ascending
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 //default return value (no sorting)

            })
        }

    }

    OpenModal(template: TemplateRef<any>, param) {
        this.taskUpdateObj = new Array<Object>();
        let obj = {
            status: param.status,
            task_name: param.task_name,
            id: param.id,
            priority: param.priority,
            completion_date: param.completion_date,
            created_date: param.created_date,
            description: param.description,
            full_name: param.full_name,
            is_delayed: param.is_delayed,
            completed_on: param.completed_on,
            assigned_email: param.email,
            user_id: this.currentUserId,
            type: param.type,
            remark: null,
        }
        console.log(param)
        this.taskUpdateObj.push(obj)
        console.log(this.taskUpdateObj)
        this.modalRef = this.modalService.show(template,{
            backdrop: true,
            ignoreBackdropClick: true
        });
    }

    // OpenPollModal(template: TemplateRef<any>, param)
    // {
    //     console.log(param)
    //     this.modalRef = this.modalService.show(template,{
    //         backdrop: true,
    //         ignoreBackdropClick: true
    //     });
    // }

    submitForm(taskUpdateObj) {
        if (taskUpdateObj.status == 'Pending') {
            this.modalRef.hide();
        }
        else if (taskUpdateObj.status == 'completed') {
            if (new Date(taskUpdateObj.completion_date).getTime() < new Date().getTime()) {
                taskUpdateObj.is_delayed = 1;
            } else {
                taskUpdateObj.is_delayed = 0;
            }
            taskUpdateObj.completed_on = new Date();
            this.updateStatus(taskUpdateObj);
        }
        else {
            taskUpdateObj.is_delayed = 0;
            this.updateStatus(taskUpdateObj);

        }
    }

    updateStatus(taskUpdateObj) {
        this.loading = true;
        this.userservice.updateStatus(taskUpdateObj)
            .then(res => {
                this.loading = false;
                let response: any = res
                this.modalRef.hide();
                this.getAllTasks(this.currentUserId);
                this.toasty.show("success", response.message);
            }, err => {
                this.loading = false;
                this.toasty.show('error', err.error);
            })
    }

    updatePollStatus(type ,data)
    {   
        this.loading =true;
        this.pollTaskObject = new Array<Object>();
        let obj = {
            id: data.id,           
            user_id: this.currentUserId,
            remark: data.remark,
            answer : type
        }
        this.pollTaskObject.push(obj);
       this.userservice.updatePollStatus(this.pollTaskObject[0]).subscribe(
           res => {
            this.loading = false;
            let response: any = res  
            this.modalRef.hide();
                this.getAllTasks(this.currentUserId);
                this.toasty.show("success", response.message);
           }
       ), err => {
        this.loading = false;
        this.toasty.show('error', err.error);
    }

        
    }

    getDelayedDays(completion: Date, completed: Date) {

        /**
         * Return number of delayed days to tooltip and the completed date.
         */
        let delay = Math.abs(0 | (new Date(completed).getTime() - new Date(completion).getTime()) * 1.16e-8);
        let completedMsg = delay != 0 ? 'Completed on : ' + new Date(completed).toDateString() + '\n' : '';
        return 'Delayed by ' + delay + ' day' + (delay > 1 ? 's\n' + completedMsg : '\n' + completedMsg)
    }

    exportAsExcel() {
        this.excel.exportAsExcelFile({ by: this.manageTaskData, to: this.myTaskData }, 'task-' + Date.now().toString() + '.xls');

        /**
         * Update the task data again.
         */
        this.getAllTasks(this.currentUserId)
    }

    clearModalData() {
       this.taskUpdateObj = new Array<Object>(); 
    }
}
