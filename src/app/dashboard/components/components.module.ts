import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';

import { MaterialModule } from '../../material.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';
import { MatCardModule } from '@angular/material/card';
import { CardHistoryComponent } from './card-history/card-history.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    HeaderComponent,
    CardComponent,
    CardHistoryComponent
  ],
  imports: [
    CommonModule, 
    MaterialModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule, 
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    HeaderComponent, 
    CardComponent
  ]
})
export class ComponentsModule { }
