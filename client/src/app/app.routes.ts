import { Routes, RouterModule } from "@angular/router";
import { CanAccess } from "../shared/shared.service";
import { MailVerficationComponent } from '../app/components/verification-email/verification-email.component'
const routes: Routes = [

    {
        path: '',
        loadChildren: './components/login/login.module#LoginModule'
    },
    {
        path: 'login',
        loadChildren: './components/login/login.module#LoginModule'
    },
    {
        path: 'task',
        canActivate: [CanAccess],
        loadChildren: './components/task/task.module#TaskModule'
    },
    // {
    //     path: 'signup',
    //     loadChildren: './components/signup/signup.module#SignUpModule'
    // },
    {
        path: 'changePassword',
        canActivate: [CanAccess],
        loadChildren: './components/changePassword/changePassword.module#ChangePasswordModule'
    },
    {
        path: 'verification/:accessToken',
        component: MailVerficationComponent
      },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: ''
    },
];


export const AppRoutes = RouterModule.forRoot(routes, { useHash: true });