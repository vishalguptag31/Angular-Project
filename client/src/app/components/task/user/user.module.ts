import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewUserComponent } from './view-user/view-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

const routes: Routes = [
  { path: '', component: ViewUserComponent },
  { path: 'add', component: AddUserComponent },
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#3c8dbc',
      secondaryColour: '#3c8dbc',
      tertiaryColour: '#3c8dbc'
  }),
  ],
  declarations: [ViewUserComponent, AddUserComponent]
})
export class UserModule { }
