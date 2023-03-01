import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from './app.component';

import { WebcamModule } from 'ngx-webcam';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MemberFormComponent } from './member-form/member-form.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { SwitcherComponent } from './switcher/switcher.component';
import {Ng2FlatpickrModule} from "ng2-flatpickr";

@NgModule({
  declarations: [
    AppComponent,
    MemberFormComponent,
    MemberDetailsComponent,
    SwitcherComponent
  ],
  imports: [
    BrowserModule,
    WebcamModule,
    HttpClientModule,
    DpDatePickerModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2FlatpickrModule
  ],
  providers: [],
  bootstrap: [AppComponent, SwitcherComponent]
})
export class AppModule { }
