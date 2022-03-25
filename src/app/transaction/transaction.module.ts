import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFormComponent } from './form/transaction-form.component';
import { Route, RouterModule } from '@angular/router';
import { PageLayoutModule } from '../shared/layouts';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { GoBackModule } from '../shared/go-back/go-back.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TransactionExistsGuard } from '../shared/transaction';

const routes: Route[] = [
  {
    path: 'add',
    component: TransactionFormComponent,
    data: {
      edit: false,
    },
  },
  {
    path: ':transactionId',
    component: TransactionFormComponent,
    canActivate: [TransactionExistsGuard],
    data: {
      edit: true,
    },
  },
];

@NgModule({
  declarations: [
    TransactionFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageLayoutModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    GoBackModule,
    MatCheckboxModule,
  ],
})
export class TransactionModule {
}
