import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from "@angular/forms";
import { AppRoutes } from './app.routes'
import { ToastrModule,ToastContainerModule } from 'ngx-toastr';
import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { HeaderService,FooterService,ToastService} from '../shared/shared.service'
import { FooterComponent } from './components/common/footer/footer.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MailVerficationComponent } from '../app/components/verification-email/verification-email.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MailVerficationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    AppRoutes,
    ToastContainerModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({preventDuplicates: true}),
    AppRoutes
  ],
  providers: [HeaderService,FooterService,ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
