import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelComponent } from './travel/travel.component';
import { HistoryComponent } from './history/history.component';

import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../../material/material/material.module';

@NgModule({
  declarations: [
    TravelComponent,
    HistoryComponent
    ],
  imports: [
    CommonModule, 
    ComponentsModule,
    MaterialModule
  ],
  exports: [
    TravelComponent, 
    HistoryComponent
  ]
})
export class PagesModule { }
