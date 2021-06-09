import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedService }  from './shared.service'

import {HttpClientModule/*, HttpClientXsrfModule*/} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PolencounterComponent } from './polencounter/polencounter.component';
import { ShowPolenComponent, DeleteDialog } from './polencounter/show-polen/show-polen.component';
import { AddPolenComponent, LoadingAnalysisComponent } from './polencounter/add-polen/add-polen.component';

// Login
import { UserService } from './user.service';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StatisticsComponent } from './statistics/statistics.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PolinicPercentageRangesComponent } from './polinic-percentage-ranges/polinic-percentage-ranges.component';
import { AddRangeComponent } from './polinic-percentage-ranges/add-range/add-range.component'
import { ShowRangeComponent, DeleteRangeDialog, InfoRangeDialog } from './polinic-percentage-ranges/show-range/show-range.component';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MainbarComponent } from './mainbar/mainbar.component';
import { PolenTypeComponent } from './polentype/polentype.component';
import { AddTypeComponent } from './polentype/add-type/add-type.component';
import { ShowTypeComponent, DeleteTypeDialog} from './polentype/show-type/show-type.component';

@NgModule({
  declarations: [
    AppComponent,
    PolencounterComponent,
    ShowPolenComponent,
    AddPolenComponent,
    DeleteDialog,
    StatisticsComponent,
    AddRangeComponent,
    PolinicPercentageRangesComponent,
    ShowRangeComponent,
    DeleteRangeDialog,
    InfoRangeDialog,
    LoadingAnalysisComponent,
    MainbarComponent,
    PolenTypeComponent,
    DeleteTypeDialog,
    AddTypeComponent,
    ShowTypeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    // Imports de Angular Material
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    // Imports de ngx-charts
    NgxChartsModule

  ],
  providers: [SharedService, UserService,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},    
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
