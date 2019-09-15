import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddTaskComponent } from './add/add-task.component';
import { ViewTaskComponent } from './view/view-task.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { CategoryComponent } from './category/category.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

const ROUTES: Routes = [
    {
        path: '', component: ViewTaskComponent
    },
    {
        path: 'add', component: AddTaskComponent
    },
    {
        path: 'edit/:id', component: AddTaskComponent
    },
    {
        path: 'user', loadChildren: './user/user.module#UserModule'
    },
    {
        path: 'categories', component: CategoryComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabsModule.forRoot(),
        LoadingModule.forRoot({
            animationType: ANIMATION_TYPES.threeBounce,
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '4px',
            primaryColour: '#3c8dbc',
            secondaryColour: '#3c8dbc',
            tertiaryColour: '#3c8dbc'
        }),
        BsDatepickerModule.forRoot(),
        RouterModule.forChild(ROUTES),
    ],
    declarations: [ViewTaskComponent, AddTaskComponent, CategoryComponent]
})
export class TaskModule { }
