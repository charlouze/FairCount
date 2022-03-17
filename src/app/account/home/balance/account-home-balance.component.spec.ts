import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountHomeBalanceComponent } from './account-home-balance.component';

describe('AccountHomeBalanceComponent', () => {
  let component: AccountHomeBalanceComponent;
  let fixture: ComponentFixture<AccountHomeBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountHomeBalanceComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountHomeBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
