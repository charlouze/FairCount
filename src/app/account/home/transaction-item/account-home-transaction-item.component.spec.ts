import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHomeTransactionItemComponent } from './account-home-transaction-item.component';
import { MatCardModule } from '@angular/material/card';

describe('AccountHomeTransactionItemComponent', () => {
  let component: AccountHomeTransactionItemComponent;
  let fixture: ComponentFixture<AccountHomeTransactionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountHomeTransactionItemComponent,
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
