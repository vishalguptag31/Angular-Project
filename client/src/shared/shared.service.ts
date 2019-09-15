import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CanActivate } from '@angular/router';
import * as XLSX from 'xlsx';

@Injectable()
export class HeaderService {

    private messageSource = new Subject<any>();
    currentMessage = this.messageSource.asObservable();

    updateHeader(data) {
        this.messageSource.next(data);
    }

    updateHeaderService(message: boolean) {
        this.messageSource.next(message)
    }

}

@Injectable()
export class FooterService {
    private messageSource = new Subject<any>();
    public currentMessage = this.messageSource.asObservable();
    updateFooter(data) {
        this.messageSource.next(data);
    }
    updateFooterService(message: boolean) {
        this.messageSource.next(message)
    }

}

@Injectable()
export class ToastService {
    constructor(
        private toasty: ToastrService
    ) { }

    show(type: string, msg: string) {
        this.toasty[type](msg, '', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
        })
    }
}

@Injectable({ providedIn: 'root' })
export class TokenService {

    setToken(token: string): void {
        if (token) {
            localStorage.setItem('jwt_token', token);
        }
    }

    authorize(): any {
        return { headers: { 'Authorization': localStorage.getItem('jwt_token') } }
    }
}

@Injectable({ providedIn: 'root' })
export class CanAccess implements CanActivate {
    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return !!localStorage.getItem('jwt_token');
    }
}

@Injectable({ providedIn: 'root' })
export class ValidationService {
    zeroSpace(str): string {
        return str.trim().replace(/  +/g, '')
    }
}

@Injectable({ providedIn: 'root' })
export class ExcelService {
    exportAsExcelFile(task: any, filename: string) {
        let assignedByMe = this.simplifyJSON(task.by, 'b');
        let assignedToMe = this.simplifyJSON(task.to, 't');
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(assignedByMe.concat(assignedToMe));
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, filename, { bookType: 'xls', type: 'buffer' });
    }

    simplifyJSON(array: any[], type: string): any[] {
        let mainArr = []
        for (let i = 0; i < array.length; i++) {
            let object = array[i];
            object = this.modifyValue(object, type)
            let secObj = {};
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    secObj[key.toUpperCase().replace('_', ' ')] = object[key]
                }
            }
            mainArr.push(secObj);
        }
        return mainArr;
    }

    modifyValue(obj, type): any {
        delete obj.email;
        obj['is_delayed'] == '0' ? obj['is_delayed'] = 'No' : obj['is_delayed'] = 'Yes';
        obj['created_date'] = new Date(obj.created_date).toDateString();
        obj['completion_date'] = new Date(obj.completion_date).toDateString();
        type == 't' ? obj['assigned_to'] = 'Me' : obj['assigned_to'] = obj.full_name;
        delete obj.full_name;
        return obj;
    }

}