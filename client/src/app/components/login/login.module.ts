import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from '@angular/router';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

const ROUTES: Routes = [
  { path: '', component: LoginComponent },
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
  declarations: [LoginComponent]
})
export class LoginModule { }
