import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './changePassword.component';
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from '@angular/router';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

const ROUTES: Routes = [
  { path: '', component: ChangePasswordComponent },
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,  
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '4px',
      primaryColour: '#3c8dbc', 
      secondaryColour: '#3c8dbc', 
      tertiaryColour: '#3c8dbc'
  }),
    RouterModule.forChild(ROUTES)  
  ],
  declarations: [ChangePasswordComponent]
})
export class ChangePasswordModule { }
