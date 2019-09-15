import { Injectable } from '@angular/core';
import { TokenService } from '../shared/shared.service';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private auth: TokenService, private http: HttpClient) { }

    /* Authorization Service start*/
    login(data): Observable<any> {
        return this.http.post(environment.API + '/login', data)
    }

    changePassword(data): Observable<any>{
        return this.http.post(environment.API + '/changePassword', data)
    }

    userSignUp(data): Observable<any>{
        return this.http.post(environment.API+ '/userSignUp', data)
    }
   
    mailVerification(accessToken) : Observable<any>{
        return this.http.post(environment.API+ '/mailVerification', accessToken)
    }
    sendEmailVerification(data): Observable<any>{
        return this.http.post(environment.API + '/resendEmailVerification', data) 
    }
    /* Authorization service end */

    getUserById(id: number): Observable<any> {
        return this.http.get(environment.API + '/getUser/' + id, this.auth.authorize())
    }

    /* Category Service start */
    getCategoryById(data) {
        return this.http.get(environment.API + '/getcategory/' + data)

    }

    saveCategory(data) {
        return this.http.post(environment.API + '/saveCategory', data)

    }

    deleteCategoryById(data) {
        return this.http.delete(environment.API + '/deleteCategoryById/' + data)

    }

    upadateCategory(data) {
        return this.http.post(environment.API + '/upadateCategory', data)

    }

    checkCategoryTaskExist(data) {
        return this.http.get(environment.API + '/checkCategoryTaskExist/' + data)
    }
    /* Category Service End */


    getAssigneeList(id: number): Observable<any> {
        return this.http.get(environment.API + '/getAssigneeList/' + id, this.auth.authorize())
    }

    getCategory(id: number) : Observable<any> {
        return this.http.get(environment.API + '/getcategory/' + id)
    }

    getTaskById(id: number) : Observable<any> {
        return this.http.get(environment.API + '/getTaskById/' + id)
    }
    /* add and update task */
    submitForm(method,api,data): Observable<any> {
        return this.http[method](environment.API + api, data)
    }
    
    addUserAssignee(user): Observable<any> {
        return this.http.post(environment.API + '/addUserAssignee', user, this.auth.authorize())
    }

    emailExists(email: string): Observable<any> {
        return this.http.get(environment.API + '/checkUniqueEmail/' + email)
    }

    phoneExists(phone: number): Observable<any> {
        return this.http.get(environment.API + '/checkUniquePhoneNumber/' + phone)
    }

    getAllTasks(data) {
        return this.http.get(environment.API + '/getAllTasks/' + data,this.auth.authorize())        
    }

    deleteTask(data) {
        return new Promise((resolve, reject) => {
            this.http.delete(environment.API + '/deleteTask/' + data)
                .subscribe(
                res => resolve(res),
                err => reject(err)
                )
        })
    }

    updateStatus(data) {
        return new Promise((resolve, reject) => {
            this.http.post(environment.API + '/updateStatus', data)
                .subscribe(
                res => resolve(res),
                err => reject(err)
                )
        })
    }

    updatePollStatus(data): Observable<any>{
        return this.http.post(environment.API + '/updatePollStatus', data, this.auth.authorize())
    }

    addUserRelation(data){
        return new Promise((resolve, reject) => {
            this.http.post(environment.API + '/addUserRelation', data, this.auth.authorize())
                .subscribe(
                res => resolve(res),
                err => reject(err)
                )
        })
    }
}