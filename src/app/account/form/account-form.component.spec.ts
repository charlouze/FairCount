import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFormComponent } from './account-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountService } from '../../shared/account';
import { AuthService } from '../../shared/auth';
import { ApplicationStateService } from '../../shared/application-state.service';
import { of } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;

describe('AccountFormComponent', () => {
  let component: AccountFormComponent;
  let fixture: ComponentFixture<AccountFormComponent>;
  const authService = createSpyObj<AuthService>('AuthService', ['login'], ['user']);
  const accountService = createSpyObj<AccountService>('accountService', ['create']);
  const appStateService = createSpyObj<ApplicationStateService>('applicationStateService', [], {
    account$: of(null),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountFormComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AccountService, useValue: accountService },
        { provide: ApplicationStateService, useValue: appStateService },
      ],
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
