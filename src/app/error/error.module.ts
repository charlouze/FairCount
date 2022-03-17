import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { PageLayoutModule } from '../shared/layouts';

const routes = [
  {
    path: '',
    component: ErrorComponent,
  },
];

@NgModule({
  declarations: [
    ErrorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    PageLayoutModule,
  ],
})
export class ErrorModule {
}
