import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components/components.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageLoginComponent } from './page-login/page-login.component';

@NgModule({
  declarations: [
    PageLoginComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ReactiveFormsModule,
    PageLoginComponent
  ]
})
export class PagesModule { }
