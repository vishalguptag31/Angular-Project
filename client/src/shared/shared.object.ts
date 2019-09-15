export class Login {
    public email: string;
    public password: string;
}


export class User {
    public id: string;
    public email: string;
    public password: string;
    public phone_number: number;
    public full_name: string;
    public user_type: string;
    public active: boolean;

}
export class Task {
    constructor() {
        this.category_id = null;
        this.user_id = null;
        this.priority = null;
        this.type = null;
    }
    public id: string;
    public category_id: number;
    public user_id: number;
    public category_name: string;
    public full_name: string;
    public priority: string;
    public task_name: string;
    public status: string;
    public assigned_by: number;
    public completion_date: Date;
    public description: string;
    public completed_on: Date;
    public is_delayed: number;
    public assigneeEmail: string;
    public planned_effort: string;
    public type : string;
}


export class AssigneeData {
    public id: number;
    public host: string;
    public full_name: string;
    public phone_number: number;
    public email: string;
    public password: string;
    public added_by: number;
    public confirm_password : string;
}

export class Category {
    public id: number;
    public category_name: string;
    public added_by: number;
}

export class ChangePasswordData {
    public userKey: string;
    public current_password: string;
    public new_password: string;
    public confirm_password: string;
}

export class SignUpData {
    constructor()
{
    this.signup =new AssigneeData
}    public signup: AssigneeData;

    }
