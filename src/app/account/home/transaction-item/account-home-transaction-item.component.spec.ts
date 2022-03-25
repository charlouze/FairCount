import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHomeTransactionItemComponent } from './account-home-transaction-item.component';
import { MatCardModule } from '@angular/material/card';
import { TransactionService } from '../../../shared/transaction';
import createSpyObj = jasmine.createSpyObj;

describe('AccountHomeTransactionItemComponent', () => {
  let component: AccountHomeTransactionItemComponent;
  let fixture: ComponentFixture<AccountHomeTransactionItemComponent>;
  const transactionService = createSpyObj<TransactionService>('transactionService', ['delete']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountHomeTransactionItemComponent,
      ],
      providers: [
        { provide: TransactionService, useValue: transactionService },
      ],
      imports: [
        MatCardModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountHomeTransactionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
