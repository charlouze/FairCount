import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { AccountFormComponent } from './form/account-form.component';
import { PageLayoutModule } from '../shared/layouts';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountHomeComponent } from './home/account-home.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { GoBackModule } from '../shared/go-back/go-back.module';
import { AccountMemberComponent } from './member/account-member.component';
import { AccountExistsGuard } from '../shared/account';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountHomeTransactionItemComponent } from './home/transaction-item/account-home-transaction-item.component';
import { AccountHomeBalanceComponent } from './home/balance/account-home-balance.component';

const routes: Route[] = [
  {
    path: 'add',
    component: AccountFormComponent,
  },
  {
    path: ':accountId',
    canActivate: [AccountExistsGuard],
    children: [
      {
        path: '',
        component: AccountHomeComponent,
      },
      {
        path: 'transaction',
        loadChildren: () => import('../transaction/transaction.module').then(m => m.TransactionModule),
      },
      {
        path: 'settings',
        component: AccountFormComponent,
      },
      {
        path: 'members',
        component: AccountMemberComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    AccountFormComponent,
    AccountHomeComponent,
    AccountMemberComponent,
    AccountHomeTransactionItemComponent,
    AccountHomeBalanceComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageLayoutModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    GoBackModule,
    MatTabsModule,
  ],
  providers: [
    CurrencyPipe,
  ],
})
export class AccountModule {
}
