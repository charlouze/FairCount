import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMemberComponent } from './account-member.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Account, AccountService } from '../../shared/account';
import { ApplicationStateService } from '../../shared/application-state.service';
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';

describe('AccountMemberComponent', () => {
  let component: AccountMemberComponent;
  let fixture: ComponentFixture<AccountMemberComponent>;
  const appStateService = createSpyObj<ApplicationStateService>('applicationStateService', [], {
    nonNullAccount$: of({} as Account),
  });
  const accountService = createSpyObj<AccountService>('accountService', ['update']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountMemberComponent],
      providers: [
        { provide: ApplicationStateService, useValue: appStateService },
        { provide: AccountService, useValue: accountService },
      ],
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
